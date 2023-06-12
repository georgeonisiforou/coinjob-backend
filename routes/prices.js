var express = require("express");
var router = express.Router();
var cron = require("node-cron");
const axios = require("axios");

const PricesItem = require("../models/pricesItemModel");

const getData = async () => {
  const cryptoPrices = await axios
    .get(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin%2Cethereum%2Ctether&vs_currencies=usd"
    )
    .then((res) => {
      const data = res.data;
      return data;
    });

  const priceObject = new PricesItem({
    prices: cryptoPrices,
    timeStamp: new Date(),
  });

  await priceObject.save();
  console.log("Cron job executed");
};

let saveCryptoPrices = cron.schedule("* * * * *", () => getData(), {
  scheduled: false,
});

router.post("/crypto/cronJob/custom", async (req, res) => {
  const customInterval = req.body;
  saveCryptoPrices.stop();
  saveCryptoPrices = cron.schedule(
    `*/${customInterval.second} ${customInterval.minute} ${customInterval.hour} ${customInterval.day} ${customInterval.month} ${customInterval.weekday}`,
    () => getData()
  );
  const pricesResults = await PricesItem.find();

  return res.status(201).json(pricesResults);
});

router.get("/crypto/prices", async (req, res) => {
  const pricesResults = await PricesItem.find();

  return res.status(201).json(pricesResults);
});

router.put("/crypto/cronJob/forceRun", async (req, res) => {
  getData();
  const pricesResults = await PricesItem.find();
  console.log("Force run executed");
  return res.status(201).json(pricesResults);
});

router.put("/crypto/cronJob/start", async (req, res) => {
  saveCryptoPrices.start();
  console.log("Cron job started");
  const pricesResults = await PricesItem.find();
  return res.status(201).json(pricesResults);
});

router.put("/crypto/cronJob/stop", async (req, res) => {
  saveCryptoPrices.stop();
  console.log("Cron job stopped");
  const pricesResults = await PricesItem.find();

  return res.status(201).json(pricesResults);
});

module.exports = router;
