import RestaurantModel from './models/Restaurant.js';

export const getRestaurant = async (req, res) => {
  const { domainName, restaurantId } = req.query;
  let filter = {};

  if(!domainName && !restaurantId) {
    return res.status(400).send('!domainName || !restaurantId is required');
  }

  if(domainName) {
    filter.domainName = domainName;
  }

  if(restaurantId) {
    filter._id = restaurantId;
  }

  try {
    const restaurant = await RestaurantModel.findOne(filter);
    if(restaurant) {
      res.status(200).send(restaurant);
    } else {
      res.status(404).send('Restaurant not found');
    }
  } catch (e) {
    res.status(500).send('Something went wrong');
  }
};

export const updateRestaurant = async (req, res) => {
  const { restaurantId } = req.params;
  const { restaurantName } = req.body;

  if(!restaurantName) {
   return res.status(400).send('restaurantName is required')
  }

  try {
    const updatedRestaurant = await RestaurantModel.findByIdAndUpdate(restaurantId, {
      displayName: restaurantName,
    }, { new: true, lean: true});
    if(!updatedRestaurant) {
      return res.status(404).send('Restaurant not found');
    }
    res.status(200).json(updatedRestaurant);
  } catch (e) {
    res.status(500).send('Something went wrong');
  }
};