const express = require("express");
const router = express.Router();
const { DaftarPesanan } = require("../models");
const { Op } = require("sequelize");

router.get("/uniqueCode", async (req, res) =>
{
    const listOfPesanan = await DaftarPesanan.findAll(
    { 
        where: 
        { 
            uniqueCode: { [Op.ne]: null }, 
            statusPembayaran: false
        },
        order: [['createdAt', 'DESC']] 
    });

    res.json(listOfPesanan);
});
router.get("/byUniqueCode/:uniqueCode", async (req, res) =>
{
    const uniqueCode = req.params.uniqueCode;

    const listOfPesanan = await DaftarPesanan.findAll(
    {
        where:
        {
            uniqueCode: 
            {
                [Op.like]: `%${uniqueCode}%`
            },
            statusPembayaran: false
        },
        order: [['createdAt', 'DESC']] 
    });

    res.json(listOfPesanan);
});
router.get("/cekUniqueCode/:uniqueCode", async (req, res) =>
{
    const uniqueCode = req.params.uniqueCode;

    const pesanan = await DaftarPesanan.findOne({ where: { uniqueCode: uniqueCode } });

    if (pesanan)
        return res.json({ error: "id sudah terpakai" });

    return res.json({ valid: true });
})
router.get("/byId/:idPesanan", async (req, res) =>
{
    const idPesanan = req.params.idPesanan;

    const pesanan = await DaftarPesanan.findOne({ where: { idPesanan: idPesanan } });

    if (pesanan)
        return res.json({ error: "id sudah terpakai" });

    return res.json({ valid: true });
});
router.get("/getByIdPesanan/:idPesanan", async (req, res) =>
{
    const idPesanan = req.params.idPesanan;

    const pesanan = await DaftarPesanan.findOne({ where: { idPesanan: idPesanan } });

    if (pesanan)
        return res.json(pesanan);

    return res.json({ noData: true });
});
router.get("/getByIdAndEmail/:idPesanan/:email", async (req, res) =>
{
    const idPesanan = req.params.idPesanan;
    const email = req.params.email;

    const pesanan = await DaftarPesanan.findOne({ where: { idPesanan: idPesanan, email: email } });

    if (pesanan)
        return res.json(pesanan);

    return res.json({ noData: true });
});
router.get("/byEmail/:email", async (req, res) =>
{
    const email = req.params.email;

    const pesanan = await DaftarPesanan.findOne({ where: { email: email, statusPembayaran: false } });

    if (pesanan)
        return res.json({ buying: true, idPesanan: pesanan.idPesanan });

    return res.json({ buying: false });
});

router.post("/", async (req, res) =>
{
    const pesanan = req.body;

    await DaftarPesanan.create(pesanan);

    res.json({ valid: true });
});
router.post("/updateStatus/:idPesanan", async (req, res) =>
{
    const idPesanan = req.params.idPesanan;

    await DaftarPesanan.update({ statusPembayaran: true }, { where: { idPesanan: idPesanan } });

    res.json({ valid: true });
});


module.exports = router;