const express = require("express");
const router = express.Router();
const { ItemPesanan } = require("../models");
const axios = require("axios");


router.get("/byIdPesanan/:idPesanan", async (req, res) =>
{
    const idPesanan = req.params.idPesanan;
    const listOfItemPesanan = await ItemPesanan.findAll(
    {
        where:
        {
            idPesanan: idPesanan
        }
    });

    res.json(listOfItemPesanan);
});

router.post("/", async (req, res) =>
{
    const idPesanan = req.body.idPesanan;

    const pesanan = await axios.get(`http://localhost:3001/daftarPesanan/byId/${idPesanan}`);

    if (pesanan.data.error)
    {
        const item = req.body;
        await ItemPesanan.create(item);
        return res.json(item);
    }

    return res.json({ error: "Pesanan tidak ditemukan" });
});



module.exports = router;