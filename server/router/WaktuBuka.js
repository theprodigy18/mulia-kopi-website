const express = require("express");
const router = express.Router();
const { WaktuBuka } = require("../models");


router.get("/", async (req, res) =>
{
    const listOfSchedule = await WaktuBuka.findAll();

    res.json(listOfSchedule);
});

router.post("/", async (req, res) =>
{
    const hari = req.body;
    await WaktuBuka.create(hari);

    res.json(hari);
});






module.exports = router;