import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/authConfig';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    // criando o schema de validação com Yup
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    // validando schema
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error' });
    }

    // pegando os dados passados no login
    const { email, password } = req.body;

    // primeiro vamos checar se existe esse email na base de dados
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // agora checamos se a senha bate
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    // Aqui o usuário está devidamente autenticado
    // Agora vamos criar o seu token
    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.privateKey, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
