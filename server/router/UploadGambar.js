const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

// #region Upload Gambar Menu
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../client/public/images/menu");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname); // Nama file unik
    },
});

const upload = multer({ storage: storage });

router.post("/menu", upload.single("gambar"), (req, res) =>
{
    if (req.file) 
    {
        return res.json({ message: "Gambar berhasil diupload", file: req.file });
    } 
    else 
    {
        return res.json({ error: "Gagal mengupload gambar" });
    }
});

// #endregion

router.post("/menu/delete", (req, res) =>
{
    const fileUrl = req.body.fileUrl; // URL path file dikirim melalui body request

    // Ekstrak path file dari URL dan buat path absolut
    const filePath = "../client/public/images/" + fileUrl; // Sesuaikan dengan struktur folder Anda

    // Hapus file menggunakan fs.unlink
    fs.unlink(filePath, (err) => 
    {
        if (err) 
        {
            return res.json({ error: "Gagal menghapus file" });
        }

        return res.json({ message: "File berhasil dihapus" });
    });
});




module.exports = router;