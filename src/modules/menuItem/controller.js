import MenuItemModel from './models/MenuItem.js';
import MenuModel from '../menu/models/Menu.js';
import { extractAuth } from '../user/extractAuth.js';
import UserModel from '../user/models/User.js';
import {upload} from '../../sevices/S3Service.js';

export const createMenuItem = async (req, res) => {
  const { name, price, description, menuId } = req.body;
  const { file } = req;
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
    if (!file) {
      throw new Error('image is required');
    }
  if (!name || !price || !description || !menuId) {
    throw new Error('name, price, description and menuId are required fields');
  }
  try {
    const s3File = await upload(file);
    const menuItem = await MenuItemModel.create({
      name,
      price,
      description,
      menuId,
      image: s3File.key,
      restaurant: user.restaurant,
    });
    res.status(201).json(menuItem);
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong');
  }
};

export const getMenuItem = async (req, res) => {
  const { restaurantId, menuId, all } = req.query;

  if(!restaurantId && !menuId)
    return res.status(400).send('!restaurantId || !menuId');

  const filter = {};
  if(restaurantId)
    filter.restaurant = restaurantId;
  else
    filter.menuId = menuId;
  if(!all)
    filter.removed = {$ne: true};

  try {
    const items = await MenuItemModel.find(filter);
    res.status(200).json(items);
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
  if (req.file) {
    const s3File = await upload(req.file);
    updatedItem.image = s3File.key;
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
