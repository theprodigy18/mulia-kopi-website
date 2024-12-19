const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config();


app.use(express.json());
app.use(cors());

const db = require("./models");

// Routers
const daftarMenuRouter = require("./router/DaftarMenu");
const waktuBukaRouter = require("./router/WaktuBuka");
const moodDetectionRouter = require("./router/MoodDetection");
const scanMoodRouter = require("./router/ScanMood");
const daftarPesananRouter = require("./router/DaftarPesanan");
const itemPesananRouter = require("./router/ItemPesanan");
const usersRouter = require("./router/Users");
const adminRouter = require("./router/Admin");
const menuByMoodRouter = require("./router/MenuByMood");
const rekomendasiMenuRouter = require("./router/RekomendasiMenu");
const keranjangRouter = require("./router/Keranjang");
const keranjangAdminRouter = require("./router/KeranjangAdmin");
const riwayatTransaksiRouter = require("./router/RiwayatTransaksi");
const uploadGambarRouter = require("./router/UploadGambar");

app.use("/daftarMenu", daftarMenuRouter);
app.use("/waktuBuka", waktuBukaRouter);
app.use("/mood-detection", moodDetectionRouter);
app.use("/scanMood", scanMoodRouter);
app.use("/daftarPesanan", daftarPesananRouter);
app.use("/itemPesanan", itemPesananRouter);
app.use("/auth", usersRouter);
app.use("/admin", adminRouter);
app.use("/menuByMood", menuByMoodRouter);
app.use("/rekomendasiMenu", rekomendasiMenuRouter);
app.use("/keranjang", keranjangRouter);
app.use("/keranjangAdmin", keranjangAdminRouter);
app.use("/riwayatTransaksi", riwayatTransaksiRouter);
app.use("/uploadGambar", uploadGambarRouter);

db.sequelize.sync().then(() =>
{
    app.listen(3001, () =>
    {
        console.log("run port 3001");
    });
});
