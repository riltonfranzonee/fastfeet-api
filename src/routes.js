import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import Problem from './app/models/Problem';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import DeliverController from './app/controllers/DeliverController';
import TransporterController from './app/controllers/TransporterController';
import ProblemController from './app/controllers/ProblemController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get('/deliveryman/:id/deliveries', TransporterController.index); // query param ?delivered= yes/not
routes.put('/deliver/:id', TransporterController.update);
// routes.post('/files/signature_id', upload.single('file'), FileController.store);

routes.get('/delivery/:id/problems', ProblemController.index);
routes.post('/delivery/:id/problems', ProblemController.store);
routes.get('/delivery/problems', async (req, res) => {
  const { page = 1 } = req.query;
  const problems = await Problem.findAll({
    order: ['created_at'],
    limit: 6,
    offset: (page - 1) * 6,
  });
  res.json(problems);
}); // query param page
routes.post('/files', upload.single('file'), FileController.store);

routes.use(authMiddleware);

routes.delete('/problem/:id/cancel-delivery', ProblemController.delete);

routes.get('/recipient', RecipientController.index); // query param ?q={name} and page
routes.post('/recipient', RecipientController.store);
routes.put('/recipient', RecipientController.update);
routes.delete('/recipient', RecipientController.delete);

routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index); // query param ?q={name} and page
routes.put('/deliveryman', DeliverymanController.update);
routes.delete('/deliveryman', DeliverymanController.delete);

routes.post('/deliver', DeliverController.store);
routes.get('/deliver', DeliverController.index); // query param ?q={productname} and page
routes.put('/deliver', DeliverController.update);
routes.delete('/deliver', DeliverController.delete);

export default routes;
