const express = require("express");
const jwt = require('jsonwebtoken')
const router = express.Router();
const bcrypt = require('bcrypt')
const ProductsModal = require('../models/ProductsModal');
const auth = require("../auth");

router.post('/create', auth, async (req, res) => {
    try {
        if (req.body.name && req.body.amount && req.body.description) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Max-Age", "1800");
            res.setHeader("Access-Control-Allow-Headers", "content-type");
            res.setHeader(
                "Access-Control-Allow-Methods",
                "PUT, POST, GET, DELETE, PATCH, OPTIONS"
            );
            const product = new ProductsModal({
                name: req.body.name,
                amount: req.body.amount,
                description: req.body.description,
            })
            await product.save((err, result) => {
                if (err) {
                    return res.json(err)
                }
                return res.json({
                    Httpcode: 200,
                    Message: "Product added Successfully",
                    product: result
                })
            })


        } else {
            return res.json({ error: "All fields required" })
        }
    } catch (error) {
        return res.json({ error: error.message })
    }
})


router.get('/getAllProducts', auth, async (req, res) => {
    try {
        const products = await ProductsModal.find();
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
            products: products
        })
    } catch (error) {
        return res.json({ error: error.message })
    }
})

router.post('/update', auth, async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Max-Age", "1800");
        res.setHeader("Access-Control-Allow-Headers", "content-type");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "PUT, POST, GET, DELETE, PATCH, OPTIONS"
        );
        const product = await ProductsModal.findByIdAndUpdate(req.body._id, {
            name: req.body.name,
            amount: req.body.amount,
            description: req.body.description,
        })
        return res.json({
            Httpcode: 200,
            Message: "Product updated Successfully",
            product: product
        })


    } catch (error) {
        return res.json({ error: error.message })
    }
})


router.delete('/delete', auth, async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Max-Age", "1800");
        res.setHeader("Access-Control-Allow-Headers", "content-type");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "PUT, POST, GET, DELETE, PATCH, OPTIONS"
        );
        const product = await ProductsModal.findByIdAndDelete(req.body._id)
        return res.json({
            Httpcode: 200,
            Message: "Product deleted Successfully",
            product: product
        })


    } catch (error) {
        return res.json({ error: error.message })
    }
})


module.exports = router