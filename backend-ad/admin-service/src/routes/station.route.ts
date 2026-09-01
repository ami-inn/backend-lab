import express from 'express';
import { getUserContext } from '@/middlewares/getUserContext.middleware';
import { createStation } from '@/controllers/station.controller';



const router = express.Router();


router.post('/station', getUserContext, createStation);

export default router;