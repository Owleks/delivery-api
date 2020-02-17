import mongoose from 'mongoose';

const {Types} = mongoose;

const MenuSchema = new mongoose.Schema({
    name:  String,
    restaurant: Types.ObjectId,
    image: String
});

export default mongoose.model('Menu', MenuSchema);