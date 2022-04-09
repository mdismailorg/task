const express = require("express");
const jwt = require('jsonwebtoken')
const router = express.Router();
const bcrypt = require('bcrypt')
const CustomersModal = require('../models/CustomersModal');
const auth = require("../auth");

router.post('/create', async (req, res) => {
    try {
        if (req.body.password && req.body.name && req.body.email && req.body.phone) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            const Customer = new CustomersModal({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: hashedPassword
            })
            await Customer.save((err, result) => {
                if (err) {
                    return res.json(err)
                }
            })
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Max-Age", "1800");
            res.setHeader("Access-Control-Allow-Headers", "content-type");
            res.setHeader(
                "Access-Control-Allow-Methods",
                "PUT, POST, GET, DELETE, PATCH, OPTIONS"
            );
            return res.json({
                Httpcode: 200,
                Message: "Customer created Successfully",
            })
        } else {
            return res.json({ error: "All fields required" })
        }
    } catch (error) {
        return res.json({ error: error.message })
    }
})




router.get('/getUser', auth, async (req, res) => {
    return res.json(req.body)
});

module.exports = router