import {Router} from 'express';
import { EventController } from './event.controller.js';

const router = Router();
const Controller = new EventController();

router.get('/', Controller.getEvents);
router.get('/:id', Controller.getEventById);

export default router;