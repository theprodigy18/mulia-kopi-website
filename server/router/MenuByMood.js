const express = require("express");
const router = express.Router();
const axios = require("axios");
const { MenuByMood } = require("../models");

router.get("/byMood/:mood", async (req, res) =>
{
    const mood = req.params.mood;

    const rekomendasi = await MenuByMood.findAll({ where: { mood: mood } });

    // console.log(rekomendasi);
    res.json(rekomendasi);
});


module.exports = router;