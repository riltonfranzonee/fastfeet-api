import * as Yup from 'yup';
import Sequelize from 'sequelize';
import { parseISO, getHours, isBefore } from 'date-fns';

import Deliver from '../models/Deliver';
import Recipient from '../models/Recipient';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

import NewDeliverMail from '../jobs/NewDeliverMail';
import Queue from '../../lib/Queue';

class DeliverController {
  async index(req, res) {
    // render 20 per page
    const { page = 1, q } = req.query;

    // check if user passed some q

    if (q) {
      const delivers = await Deliver.findAll({
        where: {
          product: {
            [Sequelize.Op.iLike]: q,
          },
        },
        order: ['created_at'],
        attributes: [
          'id',
          'product',
          'canceled_at',
          'start_date',
          'end_date',
          'signatureId',
        ],
        limit: 6,
        offset: (page - 1) * 6,
        include: [
          {
            model: Recipient,
            as: 'recipient',
            attributes: [
              'id',
              'name',
              'state',
              'city',
              'street',
              'zip',
              'number',
            ],
          },
          {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['id', 'name'],
          },
          {
            model: File,
            as: 'signature',
            attributes: ['id', 'path', 'url'],
          },
        ],
      });

      return res.json(delivers);
    }

    const delivers = await Deliver.findAll({
      order: ['created_at'],
      attributes: [
        'id',
        'product',
        'canceled_at',
        'start_date',
        'end_date',
        'signatureId',
      ],
      limit: 6,
      offset: (page - 1) * 6,
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'state',
            'city',
            'street',
            'zip',
            'number',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['id', 'path', 'url'],
        },
      ],
    });

    return res.json(delivers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipientId: Yup.number().required(),
      deliverymanId: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Error' });
    }

    // check if the deliveryman exists

    const deliveryman = await Deliveryman.findByPk(req.body.deliverymanId);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman id not found' });
    }

    // check if the recipient exists

    const recipient = await Recipient.findByPk(req.body.recipientId);

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient id not found' });
    }

    const deliver = await Deliver.create(req.body);

    await Queue.add(NewDeliverMail.key, {
      deliveryman,
      recipient,
      product: req.body.product,
    });

    return res.json(deliver);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      start_date: Yup.date(),
      end_date: Yup.date(),
      recipientId: Yup.number(),
      deliverymanId: Yup.number(),
      product: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliver = await Deliver.findByPk(req.body.id);

    if (!deliver) {
      return res.status(400).json({ error: 'Deliver id not found' });
    }

    // req.body format: "2020-01-01T15:00:00-02:00"
    const parsedStartDate = parseISO(req.body.start_date);
    const parsedEndDate = parseISO(req.body.end_date);

    const hourStart = getHours(parsedStartDate);

    // validate time between 8-18
    if (hourStart < 8 || hourStart > 18) {
      return res
        .status(400)
        .json({ error: 'Time must be between 8:00 and 18:00' });
    }

    // check if the hour end is greater than the hour start
    const checkIsBefore = isBefore(parsedEndDate, deliver.start_date);

    if (deliver.start_date && checkIsBefore) {
      return res
        .status(400)
        .json({ error: 'End date cannot be before start date' });
    }

    const updatedDeliver = await deliver.update(req.body);
    return res.json(updatedDeliver);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const deliver = await Deliver.findByPk(req.body.id);
    if (!deliver) {
      return res.status(400).json({ error: 'Deliver not found' });
    }

    await deliver.destroy();

    return res.json({ ok: 'User was succesfully deleted' });
  }
}

export default new DeliverController();
