import mongoose from 'mongoose';

const { Types } = mongoose;

const MenuItemSchema = new mongoose.Schema({
  price: Number,
  description: String,
  name: String,
  menuId: Types.ObjectId,
  image: String,
  restaurant: Types.ObjectId,
  removed: {type: Boolean, default: false}
});

export default mongoose.model('MenuItem', MenuItemSchema);
