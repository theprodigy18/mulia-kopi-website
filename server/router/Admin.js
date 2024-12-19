const express = require("express");
const router = express.Router();
const { Admin } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

router.get("/verify-token", async (req, res) => 
{
    const token = req.headers["authorization"];
    if (!token) 
    {
        return res.json({ valid: false });
    }

    try {
        // Verifikasi token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Cek apakah username ada di database
        const admin = await Admin.findOne({ where: { username: decoded.username } });
        if (!admin) 
        {
            return res.json({ valid: false }); // Username tidak valid
        }

        return res.json({ valid: true, idAdmin: decoded.id, namaAdmin: decoded.nama }); // Token valid dan username ada
    } catch (error) {
        console.error("Token verification error:", error);
        return res.json({ valid: false }); // Token tidak valid
    }
});
router.get("/byIdAdmin/:idAdmin", async (req, res) =>
{
    const idAdmin = req.params.idAdmin;

    const admin = await Admin.findByPk(idAdmin);

    if (admin)
        return res.json(admin);

    return res.json({ noData: true });
});

router.post("/login", async (req, res) => 
{
    const { username, password } = req.body;

    try 
    {
        // Cek admin di database
        const admin = await Admin.findOne({ where: { username } });
        if (!admin) 
        {
            return res.json({ message: 'Username atau password salah' });
        }
        // Bandingkan password
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) 
        {
            return res.json({ message: 'Username atau password salah' });
        }

        // Buat token JWT
        const token = jwt.sign({ id: admin.idAdmin, nama: admin.namaAdmin, username: username, role: 'admin' }, process.env.JWT_SECRET, 
        {
            expiresIn: '1h',
        });

        return res.json({ token });
    } catch (error) 
    {
        return res.json({ message: error });
    }
});


module.exports = router;