import Sequelize from 'sequelize';
import * as Yup from 'yup';
import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    // check if the user passed a recipient name as query
    if (q) {
      const recipient = await Recipient.findAll({
        where: {
          name: {
            [Sequelize.Op.iLike]: q,
          },
        },
        order: ['created_at'],
        limit: 6,
        offset: (page - 1) * 6,
      });

      return res.json(recipient);
    }

    const recipient = await Recipient.findAll({
      order: ['created_at'],
      limit: 6,
      offset: (page - 1) * 6,
    });

    return res.json(recipient);
  }

  async store(req, res) {
    const recipient = await Recipient.create(req.body);
    return res.json(recipient);
  }

  async update(req, res) {
    const { id } = req.body;
    const recipient = await Recipient.findByPk(id);

    // para o admin atualizar os dados ele deve fornecer um id válido
    if (!id || !recipient) {
      return res.status(401).json({ error: 'Provide a valid recipient Id' });
    }

    const updatedRecipient = await recipient.update(req.body);
    return res.json(updatedRecipient);
  }

  async delete(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'You must provide a valid recipient ID' });
    }

    const recipient = await Recipient.findOne({
      where: {
        id: req.body.id,
      },
    });

    if (!recipient) {
      return res.status(400).json('não achou');
    }
    await recipient.destroy();

    return res.json({ ok: 'Recipient was succesfully deleted' });
  }
}

export default new RecipientController();
