import mongoose from 'mongoose';

const { Types } = mongoose;

export const ORDER_STATUSES = ['open', 'confirmed', 'removed'];

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
  dateUpdated: { type: Date },
  status: { type: String, default: ORDER_STATUSES[0] },
});

OrderSchema.index({ restaurant: 1, dateCreated: 1 });

export default mongoose.model('Order', OrderSchema);
