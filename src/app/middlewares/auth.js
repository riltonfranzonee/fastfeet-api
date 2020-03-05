import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/authConfig';

export default async (req, res, next) => {
  // buscando o token que é passado no header na requisição
  const authHeader = req.headers.authorization;

  // checar se ele tem o token
  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' });
  }

  // checar sem o token é válido
  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, authConfig.privateKey);
    console.log(decoded);
    return next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
