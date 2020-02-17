import mongoose from 'mongoose';

const { Types } = mongoose;

const OrderSchema = new mongoose.Schema({
  restaurant: Types.ObjectId,
  customerName: String,
  phoneNumber: String,
  address: String,
  deliveryTime: String, // TODO: make as date?
  description: String,
  items: [{
    menuItemId: Types.ObjectId,
    count: Number,
  }],
  dateCreated: { type: Date, default: Date.now },
  removed: { type: Boolean, default: false },
  isConfirmed: { type: Boolean, default: false },
});

OrderSchema.index({ restaurant: 1, dateCreated: 1 });

export default mongoose.model('Order', OrderSchema);
