import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import apis from './routes/apis';
import agendash from './routes/agendash';
import apps from './routes/apps';

// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	apis(app);
	user(app);
	agendash(app);
	apps(app);
	
	return app
}