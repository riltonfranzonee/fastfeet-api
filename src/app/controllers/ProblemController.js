import * as Yup from 'yup';
import Deliver from '../models/Deliver';
import Deliveryman from '../models/Deliveryman';
import Problem from '../models/Problem';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class ProblemController {
  async index(req, res) {
    const { id } = req.params;
    const deliver = await Deliver.findByPk(id);

    if (!deliver) {
      return res.status(400).json({ error: 'Deliver not found' });
    }

    const problems = await Problem.findAll({
      where: {
        delivery_id: id,
      },
    });

    return res.json(problems);
  }

  async store(req, res) {
    const { id } = req.params;
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliver = await Deliver.findByPk(id);
    if (!deliver) {
      return res.status(400).json({ error: 'Delivery not found' });
    }

    const problem = await Problem.create({
      description: req.body.description,
      delivery_id: id,
    });
    return res.json(problem);
  }

  async delete(req, res) {
    const { id } = req.params;
    const problem = await Problem.findByPk(id, {
      include: [
        {
          model: Deliver,
          as: 'deliver',
          attributes: ['id', 'deliveryman_id', 'product'],
          include: {
            model: Deliveryman,
            as: 'deliveryman',
            attributes: ['name', 'email'],
          },
        },
      ],
    });

    if (!problem) {
      return res.status(400).json({ error: 'Problem not found' });
    }

    const reasonableCancelments = [
      'Objeto perdido',
      'Endereço errado',
      'Limite de tentativas',
      'Objeto roubado',
      'Objeto danificado',
    ];

    if (!reasonableCancelments.includes(problem.description)) {
      return res.status(400).json({ error: 'Invalid reason' });
    }

    await Queue.add(CancellationMail.key, {
      deliveryman: problem.deliver.deliveryman,
      deliveryId: problem.deliver.id,
      product: problem.deliver.product,
      reason: problem.description,
    });

    const deliver = await Deliver.findByPk(problem.deliver.id);

    await problem.destroy();
    await deliver.update({
      canceled_at: new Date(),
    });

    return res.json(problem.deliver.id);
  }
}

export default new ProblemController();
