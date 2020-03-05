import * as Yup from 'yup';
import { Op } from 'sequelize';
import { getHours, parseISO, startOfDay, endOfDay } from 'date-fns';

import Deliver from '../models/Deliver';

class TransporterController {
  async index(req, res) {
    const { delivered } = req.query;
    const { id } = req.params;

    // List  not delivered
    if (delivered === 'not') {
      const deliver = await Deliver.findAll({
        where: {
          deliveryman_id: id,
          canceled_at: null,
          end_date: null,
        },
      });

      return res.json(deliver);
    }
    // List delivered
    if (delivered === 'yes') {
      const deliver = await Deliver.findAll({
        where: {
          deliveryman_id: id,
          end_date: {
            [Op.ne]: null,
          },
        },
      });
      return res.json(deliver);
    }

    // if no option is provided, then List all delivers
    const deliver = await Deliver.findAll({ where: { deliveryman_id: id } });
    return res.json(deliver);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
      signatureId: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const deliver = await Deliver.findByPk(id);

    if (!deliver || !id) {
      return res.status(400).json({ error: 'Deliver not found' });
    }

    const { start_date, end_date, signatureId } = req.body;

    if (start_date) {
      // req.body format: "2020-01-01T15:00:00-02:00"
      const parsedStartDate = parseISO(start_date);
      const hourStart = getHours(parsedStartDate);

      // validate time between 8-18
      if (hourStart < 8 || hourStart > 18) {
        return res
          .status(400)
          .json({ error: 'Time must be between 8:00 and 18:00' });
      }

      const dayDeliveries = await Deliver.findAll({
        where: {
          deliveryman_id: deliver.deliverymanId,
          start_date: {
            [Op.between]: [
              startOfDay(parsedStartDate),
              endOfDay(parsedStartDate),
            ],
          },
        },
      });

      if (dayDeliveries.length > 5) {
        return res.status(400).json('You reached the day limit');
      }

      await deliver.update({ start_date });
      return res.json();
    }

    if (end_date || signatureId) {
      await deliver.update({ end_date, signatureId });
      return res.json({ delivered: true });
    }

    return res.json();
  }
}

export default new TransporterController();
