import MenuItemModel from "./models/MenuItem.js";
import MenuModel from "../menu/models/Menu.js";

export const createMenuItem = async (req, res) => {
    const {name, price, description, menuId} = req.body;
    if (!name || !price || !description || !menuId)
        throw new Error('name, price, description and menuId are required fields');
    try {
        const menuItem = await MenuItemModel.create({
            name,
            price,
            description,
            menuId: menuId
        });
        res.status(201).json(menuItem);
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
};

export const getMenuItem = async (req, res) => {
    const {menuId, restaurantId} = req.query;
    try {
        if (restaurantId) {
            const menusInRestaurant = await MenuModel.find({restaurant: restaurantId});
            const menuIds = menusInRestaurant.map(item => item._id);
            const items = await MenuItemModel.find({menuId: {$in: menuIds}});
            res.status(200).send(items);
        } else {
            const items = await MenuItemModel.find({
                menuId
            });
            res.status(200).json(items)
        }
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
};

export const updateMenuItem = async (req, res) => {
    const {id} = req.params;
    const {name, price, description} = req.body;
    const updatedItem = {};

    if (name)
        updatedItem.name = name;
    if (price)
        updatedItem.price = price;
    if (description)
        updatedItem.description = description;

    try {
        const menuItem = await MenuItemModel.findOneAndUpdate({_id: id}, updatedItem, {new: true});
        if (!menuItem)
            return res.status(404).send(`menus with id ${id} not found`);
        res.status(200).json(menuItem);
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
};

export const deleteMenuItem = async (req, res) => {
    const {id} = req.params;
    if (!id)
        throw new Error('Id field is required');
    try {
        await MenuItemModel.deleteOne({
            _id: id
        });
        res.status(204).send();
    } catch (e) {
        console.log(e);
        res.status(500).send('Something went wrong');
    }
};