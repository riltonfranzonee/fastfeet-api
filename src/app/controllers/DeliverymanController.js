import * as Yup from 'yup';
import Sequelize from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { page = 1, q, id } = req.query;

    // this is for deliveryman who is accessing from mobile
    if (id) {
      const deliverymens = await Deliveryman.findOne({
        where: {
          id,
        },
        attributes: ['id', 'name', 'email', 'avatar_id', 'created_at'],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });
      return res.json(deliverymens);
    }

    // check if user passed the deliveryman name
    if (q) {
      const deliverymens = await Deliveryman.findAll({
        where: {
          name: {
            [Sequelize.Op.iLike]: q,
          },
        },
        attributes: ['id', 'name', 'email', 'avatar_id'],
        order: ['created_at'],
        limit: 6,
        offset: (page - 1) * 6,
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['name', 'path', 'url'],
          },
        ],
      });
      return res.json(deliverymens);
    }

    const deliverymens = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      order: ['created_at'],
      limit: 6,
      offset: (page - 1) * 6,
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(deliverymens);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    // check if the email is already registered
    const isRegistered = await Deliveryman.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (isRegistered) {
      return res
        .status(400)
        .json({ error: 'The email provided is already registered' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string(),
      email: Yup.string().email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const deliveryman = await Deliveryman.findByPk(req.body.id);

    const updatedDeliveryman = await deliveryman.update(req.body);

    return res.json(updatedDeliveryman);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'You must provide a valid deliveryman ID' });
    }

    await Deliveryman.destroy({
      where: {
        id: req.body.id,
      },
    });

    return res.json({ ok: 'User was succesfully deleted' });
  }
}

export default new DeliverymanController();
