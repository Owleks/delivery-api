import MenuItemModel from './models/MenuItem.js';
import MenuModel from '../menu/models/Menu.js';
import { extractAuth } from '../user/extractAuth.js';
import UserModel from '../user/models/User.js';

export const createMenuItem = async (req, res) => {
  const { name, price, description, menuId } = req.body;

  const { userId } = extractAuth(req);
  const [menu, user] = await Promise.all([
    MenuModel.findOne({ _id: menuId }),
    UserModel.findOne({ _id: userId }),
  ]);

  if (!user || !menu) {
    throw new Error('Щось не знайдено');
  }

  if (menu.restaurant.toString() !== user.restaurant.toString()) {
    throw new Error('Forbidden');
  }

  if (!name || !price || !description || !menuId) {
    throw new Error('name, price, description and menuId are required fields');
  }
  try {
    const menuItem = await MenuItemModel.create({
      name,
      price,
      description,
      menuId,
      restaurant: user.restaurant,
    });
    res.status(201).json(menuItem);
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong');
  }
};

export const getMenuItem = async (req, res) => {
  // TODO: add support to return all items, including removed
  const { menuId, restaurantId } = req.query;
  try {
    if (restaurantId) {
      const items = await MenuItemModel.find({ restaurant: restaurantId, removed: {$ne: true} });
      res.status(200).send(items);
    } else {
      const items = await MenuItemModel.find({ menuId, removed: {$ne: true} });
      res.status(200).json(items);
    }
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong');
  }
};

export const updateMenuItem = async (req, res) => {
  const { menuItemId } = req.params;
  const { userId } = extractAuth(req);
  const menuItem = await MenuItemModel.findOne({ _id: menuItemId });
  const [menu, user] = await Promise.all([
    MenuModel.findOne({ _id: menuItem.menuId }),
    UserModel.findOne({ _id: userId }),
  ]);

  if (!user || !menu) {
    throw new Error('Щось не знайдено');
  }

  if (menu.restaurant.toString() !== user.restaurant.toString()) {
    throw new Error('Forbidden');
  }
  const { name, price, description } = req.body;
  const updatedItem = {};

  if (name) {
    updatedItem.name = name;
  }
  if (price) {
    updatedItem.price = price;
  }
  if (description) {
    updatedItem.description = description;
  }

  try {
    const menuItem = await MenuItemModel.findOneAndUpdate({ _id: menuItemId }, updatedItem, { new: true });
    if (!menuItem) {
      return res.status(404).send(`menus with id ${menuItemId} not found`);
    }
    res.status(200).json(menuItem);
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong');
  }
};

export const deleteMenuItem = async (req, res) => {
  const { menuItemId } = req.params;
  const { userId } = extractAuth(req);

  const menuItem = await MenuItemModel.findOne({ _id: menuItemId });

  const [menu, user] = await Promise.all([
    MenuModel.findOne({ _id: menuItem.menuId }),
    UserModel.findOne({ _id: userId }),
  ]);

  if (!user || !menu) {
    throw new Error('Щось не знайдено');
  }

  if (menu.restaurant.toString() !== user.restaurant.toString()) {
    throw new Error('Forbidden');
  }

  if (!menuItemId) {
    throw new Error('Id param is required');
  }
  try {
    await MenuItemModel.updateOne({
      _id: menuItemId,
    }, {removed: true});
    res.status(204).send();
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong');
  }
};
