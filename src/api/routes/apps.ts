import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import Apps from '../../services/apps';
import { Container } from 'typedi'
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
     async (req: Request, res: Response) => {
      const appsService = Container.get(Apps);
      try {
        const userApps = await appsService.dashboardApps(req.currentUser, req.limit, req.offset);
        console.log(userApps);
        return res.json(userApps).status(200)
      }
      catch (err) {
        // Define errors thrown by service.
        return res.json(err).status(500);
      }
    
  });
};
