import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import { celebrate, Joi } from 'celebrate';
const route = Router();

export default (app: Router) => {
  app.use('/apps', route);

  // This might be betters in a 'dashboard route' later.
  route.get('', 
    middlewares.isAuth, 
    middlewares.attachCurrentUser,
    celebrate({
      query: {
        limit: Joi.number().integer().min(0).max(100),
        offset: Joi.number().integer().min(0)
      },
    }),
    (req: Request, res: Response) => {
    return res.json({ user: req.currentUser }).status(200);
  });
};
