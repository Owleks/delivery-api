import express from 'express';

import { getRestaurant, updateRestaurant } from './controller.js';
import { runAsyncWrapper } from '../../utils/asyncMiddleware.js';

const restaurantRouter = new express.Router();

restaurantRouter.get('/', runAsyncWrapper(getRestaurant));
restaurantRouter.put('/:restaurantId', runAsyncWrapper(updateRestaurant));

export default restaurantRouter;
