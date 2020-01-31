import mongoose from 'mongoose';

import OrderModel from './models/Order.js';
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

export const markOrderAsRemoved = async (req, res) => {
  const { orderId } = req.params;
  const { userId } = extractAuth(req);

  try {
    const user = await UserModel.findOne({ _id: userId });
    if (!user) {
      throw { status: 401, message: 'Not authorized' };
    }
    const orderItem = await OrderModel.findOne({ _id: orderId });
    if (!orderItem) {
      throw { status: 404, message: 'Order not found' };
    }
    if (orderItem.restaurant.toString() !== user.restaurant.toString()) {
      return res.status(403).send('Not an owner');
    }
    await OrderModel.update({ _id: orderItem._id }, { removed: true });
    res.status(204).send();

  } catch (e) {
    if (e.status) {
      res.status(e.status).send(e.message);
    } else {
      throw e;
    }
  }
};
