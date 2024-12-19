const express = require("express");
const router = express.Router();
const { KeranjangAdmin } = require("../models");
const Sequelize = require("sequelize");
const axios = require("axios");

router.get("/byIdMenu/:idMenu", async (req, res) =>
{
    const idMenu = req.params.idMenu;

    const item = await KeranjangAdmin.findOne({ where: { idMenu: idMenu } });

    if (item)
        return res.json(item);

    return res.json({ noData: true });
});
router.get("/", async (req, res) =>
{
    const items = await KeranjangAdmin.findAll(
    {
        order: [['createdAt', 'DESC']]
    });

    return res.json(items);
})

router.post("/", async (req, res) =>
{
    const idMenu = req.body.idMenu;

    const pesanan = await axios.get(`http://localhost:3001/keranjangAdmin/byIdMenu/${idMenu}`);

    if (pesanan.data.noData)
    {
        const order = req.body;

        await KeranjangAdmin.create(order);

        return res.json(order);
    }
    else
    {
        await KeranjangAdmin.update(
            { jumlah: Sequelize.literal('jumlah + 1') }, // Set token to null
            { where: { idMenu: idMenu } }
        );

        return res.json({ message: "Add" });
    }
});
router.post("/minus", async (req, res) =>
{
    const idMenu = req.body.idMenu;

    const pesanan = await axios.get(`http://localhost:3001/keranjangAdmin/byIdMenu/${idMenu}`);

    if (!pesanan.data.noData)
    {
        if (pesanan.data.jumlah > 1)
        {
            await KeranjangAdmin.update(
                { jumlah: Sequelize.literal('jumlah - 1') }, // Set token to null
                { where: { idMenu: idMenu } }
            );
        }
        else
        {    
            await KeranjangAdmin.destroy( { where: { idMenu: idMenu }});
        }

        return res.json({ message: "minus"});
    }

    return res.json({ noData: true });
})
router.post("/delete", async (req, res) =>
{
    await KeranjangAdmin.destroy({ where: {} });

    res.json({ message: "deleted" });
})

module.exports = router;