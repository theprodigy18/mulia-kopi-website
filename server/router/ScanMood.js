const express = require("express");
const router = express.Router();
const axios = require("axios");
const { ScanMood } = require("../models");

router.get("/byId/:idScan", async (req, res) =>
{
    const idScan = req.params.idScan;

    const mood = await ScanMood.findOne({ where: { idScan: idScan } });

    if (mood)
        return res.json({ error: "id sudah terpakai" });

    return res.json({ valid: true });
});
router.get("/byIdAndEmail/:idScan/:email", async (req, res) =>
{
    const idScan = req.params.idScan;
    const email = req.params.email;

    const mood = await ScanMood.findOne({ where: { idScan: idScan, email: email } });

    if (!mood)
        return res.json({ error: "data tidak ditemukan" });

    return res.json({ valid: true, mood: mood.mood });
});

router.post("/", async (req, res) => {
    const mood = req.body;
    await ScanMood.create(mood);

    const moodName = req.body.mood;

    try {
        const response = await axios.get(`http://localhost:3001/menuByMood/byMood/${moodName}`);
        
        const menuItems = response.data;

        // Menyimpan semua promise ke dalam array
        const promises = menuItems.map(item => {
            return axios.post("http://localhost:3001/rekomendasiMenu", { idScan: req.body.idScan, idMenu: item.idMenu });
        });

        // Menunggu semua permintaan selesai
        await Promise.all(promises);

        // Mengirim respon ketika semua permintaan selesai
        return res.json({ message: "Data berhasil disimpan dan rekomendasi menu ditambahkan" });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Terjadi kesalahan saat menambahkan rekomendasi menu" });
    }
});


module.exports = router;