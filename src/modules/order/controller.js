import mongoose from 'mongoose';

import OrderModel, { ORDER_STATUSES } from './models/Order.js';
import UserModel from '../user/models/User.js';
import { extractAuth } from '../user/extractAuth.js';


export const createOrder = async (req, res) => {
  const { customerName, phoneNumber, address, deliveryTime, description, items, restaurantId } = req.body;
  if (!customerName || !phoneNumber || !address || !deliveryTime || !description || !items || !restaurantId) {
    throw new Error('!customerName || !phoneNumber || !address || !deliveryTime || !description || !items || !restaurantId');
  }

  try {
    const newOrder = await OrderModel
      .create({
        restaurant: mongoose.Types.ObjectId(restaurantId),
        customerName,
        phoneNumber,
        address,
        deliveryTime,
        description,
        items,
      });

    res.status(201).json(newOrder);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message || 'Something went wrong');
  }
};

export const getOrders = async (req, res) => {
  const { userId } = extractAuth(req);
  const user = await UserModel.findById(userId);

  const dateFrom = new Date(req.query.dateFrom || 0);
  const dateTo = new Date(req.query.dateTo || Date.now());

  const filter = {
    restaurant: user.restaurant,
    dateCreated: {
      $gte: dateFrom,
      $lte: dateTo,
    },
  };

  if (!user) {
    throw new Error('User not found');
  }

  try {
    const orders = await OrderModel.find(filter);

    res.status(200).json(orders);
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message || 'Something went wrong');
  }
};

export const getOrder = async (req, res) => {
  const { userId } = extractAuth(req);
  const { orderId } = req.params;
  try {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw { status: 401, message: 'Not authorized' };
    }
    if (!orderId) {
      throw { status: 400, message: '!orderId' };
    }
    const order = await OrderModel.findOne({ _id: orderId });
    if (!order) {
      throw { status: 404, message: 'Order not found' };
    }
    if (order.restaurant.toString() !== user.restaurant.toString()) {
      throw { status: 403, message: 'Not an owner' };
    }
    res.status(200).json(order);
  } catch (e) {
    if (e.status) {
      res.status(e.status).send(e.message);
    } else {
      throw e;
    }
  }
};

export const updateOrder = async (req, res) => {
  const { userId } = extractAuth(req);
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      throw { status: 401, message: 'Not authorized' };
    }
    if (!orderId) {
      throw { status: 400, message: '!orderId' };
    }
    if (ORDER_STATUSES.indexOf(status) < 0) {
      throw { status: 400, message: 'Incorrect order status' };
    }

    const orderToUpdate = await OrderModel.findOne({ _id: orderId });
    if (!orderToUpdate) {
      throw { status: 404, message: 'Order not found' };
    }
    if (orderToUpdate.restaurant.toString() !== user.restaurant.toString()) {
      throw { status: 403, message: 'Not an owner' };
    }
    const dateUpdated = Date.now();
    const updatedOrder = await OrderModel.findOneAndUpdate(
      { _id: orderToUpdate._id },
      { status, dateUpdated },
      { new: true },
    );
    res.status(200).send(updatedOrder);
  } catch (e) {
    if (e.status) {
      res.status(e.status).send(e.message);
    } else {
      throw e;
    }
  }
};
