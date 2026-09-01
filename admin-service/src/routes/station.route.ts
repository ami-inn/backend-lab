import express from 'express';
import { getUserContext } from '@/middlewares/getUserContext.middleware';
import { createStation, getAllStations, updateStation, deleteStation, getStationById } from '@/controllers/station.controller';



const router = express.Router();


//admin station routes
router.post('/station', getUserContext, createStation);
router.get('/station', getUserContext, getAllStations);
router.put('/station/:id', getUserContext, updateStation);
router.delete('/station/:id', getUserContext, deleteStation);
router.get('/station/:id', getUserContext, getStationById);
//end of admin station routes
router.get('/station/search', getUserContext, getAllStations);
export default router;