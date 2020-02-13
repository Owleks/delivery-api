import express from 'express';

import { createOrder, getOrders, getOrder, markOrderAsRemoved, updateOrder } from './controller.js';
import { runAsyncWrapper } from '../../utils/asyncMiddleware.js';

const orderRouter = new express.Router();

orderRouter.post('/', runAsyncWrapper(createOrder));
orderRouter.get('/', runAsyncWrapper(getOrders));
orderRouter.get('/:orderId', runAsyncWrapper(getOrder));
orderRouter.put('/:orderId', runAsyncWrapper(updateOrder));
orderRouter.delete('/:orderId', runAsyncWrapper(markOrderAsRemoved));

export default orderRouter;
