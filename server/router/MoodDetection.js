const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) =>
{
    await axios.post('http://localhost:5000/detect-mood', { image: req.body.image }).then((response) =>
    {
        const validMoods = ["Bahagia", "Sedih", "Marah", "Takut", "Normal"];
        
        if (validMoods.includes(response.data.mood)) {
            return res.json({ mood: response.data.mood }); 
        } else {
            return res.json({ error: response.data.mood });
        }
    }).catch((error) =>
    {
        return res.send(error);
    });
});


module.exports = router;