const mongoose = require("mongoose");

const pricesItemSchema = new mongoose.Schema({
  prices: Object,
  timeStamp: Date,
});

const PricesItem = mongoose.model("PricesItem", pricesItemSchema);

module.exports = PricesItem;
