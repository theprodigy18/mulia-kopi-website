const express = require("express");
const router = express.Router();
const { DaftarMenu } = require("../models");
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

router.get("/", async (req, res) =>
{
    const listOfMenu = await DaftarMenu.findAll(
    {
        where:
        {
            isDeleted: false
        },
        order: [['namaMenu', 'ASC']]
    });

    res.json(listOfMenu);
});
router.get("/:category", async (req, res) =>
{
    const category = req.params.category;

    const listOfMenu = await DaftarMenu.findAll(
    {
        where:
        {
            kategori: category,
            isDeleted: false
        },
        order: [['namaMenu', 'ASC']]
    });

    res.json(listOfMenu);
});
router.get("/byId/:idMenu", async (req, res) =>
{
    const idMenu = req.params.idMenu;

    const menu = await DaftarMenu.findByPk(idMenu);

    res.json(menu);
});
router.get("/byName/:name", async (req, res) =>
{
    const menuName = req.params.name;
    const listOfMenu = await DaftarMenu.findAll(
    {
        where:
        {
            namaMenu: 
            {
                [Op.like]: `%${menuName}%`
            },
            isDeleted: false
        },
        order: [['namaMenu', 'ASC']]
    })

    res.json(listOfMenu);
});

router.post("/", async (req, res) =>
{
    const menu = req.body;

    const searchMenu = await DaftarMenu.findOne({ where: { namaMenu: menu.namaMenu } });

    if (searchMenu)
        return res.json({ alreadyExist: true });

    const kategoriHuruf = 
    {
        kopi: 'K',
        'non-kopi': 'N',
        makanan: 'M'
        // Tambahkan kategori lain jika diperlukan
    };
    // Ambil huruf depan berdasarkan kategori
    const hurufDepan = kategoriHuruf[menu.kategori];

    const allIds = await DaftarMenu.findAll(
    {
        where: { kategori: menu.kategori },
        order: [['idMenu', 'ASC']], // Mengurutkan berdasarkan id ascending
        attributes: ['idMenu'], // Hanya ambil kolom id
    });

    // Ekstrak angka dari id dan simpan dalam array
    const angkaIds = allIds.map((item) => parseInt(item.idMenu.slice(1), 10)); // Menghapus "K" dan mengubah ke angka
    let idBaru = null;

    if (angkaIds.length === 0)
    {
        idBaru = `${hurufDepan}1`;
    }
    else
    {
        // Cek apakah ada angka yang hilang
        for (let i = 1; i <= Math.max(...angkaIds) + 1; i++) 
        {
            if (!angkaIds.includes(i)) {
                idBaru = `${hurufDepan}${i}`; // Jika angka tidak ada dalam array, buat id baru
                break;
            }
        }
        // Jika tidak ada angka yang hilang, gunakan id terakhir + 1
        if (!idBaru) 
        {
            const lastId = angkaIds[angkaIds.length - 1]; // Ambil id terakhir
            idBaru = `${hurufDepan}${lastId + 1}`; // Buat id baru berdasarkan id terakhir
        }
    }

    await DaftarMenu.create(
    { 
        idMenu: idBaru,
        namaMenu: menu.namaMenu,
        kategori: menu.kategori,
        gambar: menu.gambar,
        detailMenu: menu.detailMenu,
        harga: menu.harga,
        stok: menu.stok
    });
    return res.json(menu);
});

router.post("/update/:idMenu", async (req, res) =>
{
    const idMenu = req.params.idMenu;

    const { namaMenu, gambar, detailMenu, harga, stok } = req.body;

    try
    {
        await DaftarMenu.update(
        {
            namaMenu: namaMenu,
            gambar: gambar,
            detailMenu: detailMenu,
            harga: harga,
            stok: stok
        }, { where: { idMenu: idMenu } });

        return res.json({ success: true });
    }
    catch (error)
    {
        return res.json({ error: error });
    }
});

router.post("/minusStok/:idMenu", async (req, res) =>
{
    const idMenu = req.params.idMenu;
    const { jumlah } = req.body;

    await DaftarMenu.update(
    { stok: Sequelize.literal(`stok - ${jumlah}`) },
    { where: { idMenu: idMenu } })

    return res.json({ success: true });
});
router.post("/delete/:idMenu", async (req, res) =>
{
    const idMenu = req.params.idMenu;

    try
    {
        await DaftarMenu.update(
        { isDeleted: true },
        { where: { idMenu: idMenu } });
    
        return res.json({ success: true });
    }
    catch (error)
    {
        return res.json({ error: error });
    }
});

module.exports = router;