import express from 'express';
import { getUserContext } from '@/middlewares/getUserContext.middleware';
import { createTrainController } from '@/controllers/train.controller';


const router = express.Router();


//admin station routes
router.post('/train', getUserContext, createTrainController);



export default router;