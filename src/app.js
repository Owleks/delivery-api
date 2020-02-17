import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import restaurantRouter from './modules/restaurant/router.js';
import menuRouter from './modules/menu/router.js';
import userRouter from './modules/user/router.js';
import orderRouter from './modules/order/router.js';
import menuItemRouter from "./modules/menuItem/router.js";

const app = express();

// const userPass = 'nH1MzZgaSB5yrdN1';
// const userLogin = 'deliverUser';

app.use('/uploads', express.static('../uploads'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.json());
app.use(cors());

app.use('/restaurant', restaurantRouter);
app.use('/menu', menuRouter);
app.use('/menu-item', menuItemRouter);
app.use('/user', userRouter);
app.use('/order', orderRouter);

app.use((error, req, res, next) => {
  if (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
  next();
});

mongoose.connect('mongodb+srv://deliverUser:nH1MzZgaSB5yrdN1@deliver-kxvhj.mongodb.net/deliver?retryWrites=true&w=majority', { useNewUrlParser: true })
  .then(() => {
    console.log('Connected to DB');
    app.listen(3000, () => console.log(`Example app listening on port 3000!`));
  })
  .catch(() => {
    console.log('Could not connect to DB');
  });

