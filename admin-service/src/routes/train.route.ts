import express from 'express';
import { getUserContext } from '@/middlewares/getUserContext.middleware';
import { createTrainController, getAllTrainsController, updateTrainController, deleteTrainController, getTrainByIdController } from '@/controllers/train.controller';


const router = express.Router();


//admin station routes
router.post('/train', getUserContext, createTrainController);
router.get('/train', getUserContext, getAllTrainsController);
router.get('/train/:id', getUserContext, getTrainByIdController);
router.put('/train/:id', getUserContext, updateTrainController);
router.delete('/train/:id', getUserContext, deleteTrainController);



export default router;