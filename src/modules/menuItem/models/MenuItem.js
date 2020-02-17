import mongoose from 'mongoose';

const {Types} = mongoose;

const MenuItemSchema = new mongoose.Schema({
    price: Number,
    description: String,
    name:  String,
    menuId: Types.ObjectId,
    image: String
});

export default mongoose.model('MenuItem', MenuItemSchema);