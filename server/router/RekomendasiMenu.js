const express = require("express");
const router = express.Router();
const axios = require("axios");
const { RekomendasiMenu } = require("../models");


router.get("/byId/:idScan", async (req, res) =>
{
    const idScan = req.params.idScan;

    const rekomendasiList = await RekomendasiMenu.findAll({ where: { idScan: idScan } });

    if (!rekomendasiList)
        return res.json({ error: "tidak ada rekomendasi" });

    return res.json(rekomendasiList);
});

router.post("/", async (req, res) =>
{
    const rekomendasi = req.body;

    await RekomendasiMenu.create(rekomendasi);

    res.json(rekomendasi);
});


module.exports = router;