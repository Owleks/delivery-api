import MenuModel from './models/Menu.js';
import UserModel from '../user/models/User.js';

import { extractAuth } from '../user/extractAuth.js';
import { upload } from '../../sevices/S3Service.js';


export const createMenu = async (req, res) => {
  const { userId } = extractAuth(req);
  const { name } = req.body;
  if (!name || !req.file) {
    throw new Error('Name and image are required');
  }
  try {
    const s3File = await upload(req.file);
    const user = await UserModel.findById(userId);
    const createdMenu = await MenuModel.create({
      name,
      image: s3File.key,
      restaurant: user.restaurant,
    });
    res.status(201).json(createdMenu);
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong');
  }
};


export const deleteMenu = async (req, res) => {
  const { menuId } = req.params;
  if (!menuId) {
    throw new Error('Id field is required');
  }
  try {
    await MenuModel.deleteOne({
      _id: menuId,
    });
    res.status(204).send();
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong');
  }
};

export const getMenus = async (req, res) => {
  const { restaurantId, menuId } = req.query;
  const filter = {};
  if (menuId) {
    filter._id = menuId;
  } else if (restaurantId) {
    filter.restaurant = restaurantId;
  }

  try {
    const menus = await MenuModel.find(filter);
    res.status(200).json(menus);
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong');
  }
};

export const updateMenu = async (req, res) => {
  const { menuId } = req.params;
  const { name } = req.body;
  const updatedFields = {};
  try {
    if (req.file) {
      const s3File = await upload(req.file);
      updatedFields.image = s3File.key;
    }
    if (name) {
      updatedFields.name = name;
    }
    const updatedMenu = await MenuModel.findOneAndUpdate({ _id: menuId }, updatedFields);

    res.status(200).json(updatedMenu);
  } catch (e) {
    console.log(e);
    res.status(500).send('Something went wrong');
  }
};
