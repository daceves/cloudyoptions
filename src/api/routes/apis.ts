import { Router, Request, Response } from 'express';
import middlewares from '../middlewares';
import Apis from '../../services/apis';
import { Container } from 'typedi'
import { celebrate, Joi } from 'celebrate';
const route = Router();

export default (app: Router) => {
  app.use('/apis', route);


  route.get('', 
    // middlewares.isAuth, 
    // middlewares.attachCurrentUser,
    celebrate({
      query: {
        limit: Joi.number().integer().min(0).max(100),
        offset: Joi.number().integer().min(0)
      },
    }),
     async (req: Request, res: Response) => {
      const apisService = Container.get(Apis);
      try {
        const apiResults = await apisService.getUserApis(req.query.limit, req.query.offset);
        return res.json(apiResults).status(200)
      }
      catch (err) {
        // Define errors thrown by service.
        return res.json(err).status(500);
      }
    
  });
  
  route.get('/:apiId', 
    middlewares.isAuth, 
    middlewares.attachCurrentUser,
     async (req: Request, res: Response) => {
      const apisService = Container.get(Apis);
      try {
        const api = await apisService.getApiById(req.params.apiId);
        return res.json(api).status(200)
      }
      catch (err) {
        // Define errors thrown by service.
        return res.json(err).status(500);
      }
    
  });

  route.post('', 
    middlewares.isAuth, 
    middlewares.attachCurrentUser,
    celebrate({
      body: {
        name: Joi.string().required(),
        version: Joi.string().required(),
        source: Joi.string().required(),
        published: Joi.boolean().required()
      },
    }),
     async (req: Request, res: Response) => {
      const apisService = Container.get(Apis);
      try {
        const api = await apisService.createApi(req.body);

        return res.json(api).status(200)
      }
      catch (err) {
        // Define errors thrown by service.
        return res.json(err).status(500);
      }
    
  });
  
};
