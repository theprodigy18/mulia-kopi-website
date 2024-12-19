const express = require("express");
const router = express.Router();
const axios = require("axios");
const { RiwayatTransaksi } = require("../models");
const { Op } = require("sequelize");

const rounded = (num) =>
{
    if (num % 500 === 0)
        return num;

    return Math.ceil(num / 500) * 500;
}

router.get("/", async (req, res) =>
{
    const transaksi = await RiwayatTransaksi.findAll(
    {
        order: [['createdAt', 'DESC']] 
    });
    
    res.json(transaksi);
});
router.get("/byIdPesanan/:idPesanan", async (req, res) =>
{
    const idPesanan = req.params.idPesanan;

    const transaksi = await RiwayatTransaksi.findOne({ where: { idPesanan: idPesanan } });

    if (transaksi)
        return res.json(transaksi);

    return res.json({ noData: true });
});
router.get("/byIdTransaksi/:idTransaksi", async (req, res) =>
{
    const idTransaksi = req.params.idTransaksi;

    const transaksi = await RiwayatTransaksi.findOne({ where: { id: idTransaksi } });

    if (transaksi)
        return res.json(transaksi);

    return res.json({ noData: true });
});
router.get("/byDate/:date", async (req, res) =>
{
    const date = req.params.date;

    const from = new Date(date);
    from.setHours(0, 0, 1);
    const to = new Date(date);
    to.setHours(23, 59, 59);

    const transaksi = await RiwayatTransaksi.findAll(
    {
        where:
        {
            createdAt:
            {
                [Op.between]: [from, to]
            }
        }
    })

    return res.json(transaksi);
})

router.post("/", async (req, res) =>
{
    const idPesanan = req.body.idPesanan;

    const pesanan = await axios.get(`http://localhost:3001/daftarPesanan/byId/${idPesanan}`);

    if (pesanan.data.error)
    {
        const transaksi = req.body;
        const totalHarga = transaksi.totalHarga;
        const diskon = transaksi.diskon / 100 * totalHarga;
        const pajak = transaksi.pajak / 100 * totalHarga;
        const totalHargaFinal = rounded(totalHarga - diskon + pajak);
        await RiwayatTransaksi.create(
        {
            idPesanan: transaksi.idPesanan,
            idAdmin: transaksi.idAdmin,
            totalHargaTemp: transaksi.totalHarga,
            diskon: transaksi.diskon,
            pajak: transaksi.pajak,
            totalHarga: totalHargaFinal,
            metodePembayaran: transaksi.metodePembayaran,
        }
        );
        return res.json(transaksi);
    }

    return res.json({ error: "Pesanan tidak ditemukan" });
});

module.exports = router;