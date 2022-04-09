const express = require("express");
const jwt = require('jsonwebtoken')
const router = express.Router();
const bcrypt = require('bcrypt')
const CartModal = require('../models/CartModal');
const auth = require("../auth");

router.post('/create', auth, async (req, res) => {
    try {
        if (req.body.quantity && req.body.customerId && req.body.productId) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Max-Age", "1800");
            res.setHeader("Access-Control-Allow-Headers", "content-type");
            res.setHeader(
                "Access-Control-Allow-Methods",
                "PUT, POST, GET, DELETE, PATCH, OPTIONS"
            );
            const cart = new CartModal({
                customerId: req.body.customerId,
                productId: req.body.productId,
                quantity: req.body.quantity,
            })
            await cart.save((err, result) => {
                if (err) {
                    return res.json(err)
                }
                return res.json({
                    Httpcode: 200,
                    Message: "Product added to cart",
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


router.get('/getCart', auth, async (req, res) => {
    try {
        const cart = await CartModal.find({ customerId: req.query.customerId });
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
            cart: cart
        })
    } catch (error) {
        return res.json({ error: error.message })
    }
})

router.post('/updateQuantity', auth, async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Max-Age", "1800");
        res.setHeader("Access-Control-Allow-Headers", "content-type");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "PUT, POST, GET, DELETE, PATCH, OPTIONS"
        );
        const cartItem = await CartModal.findByIdAndUpdate(req.body._id, {
            quantity: req.body.quantity,
        })
        return res.json({
            Httpcode: 200,
            Message: "Cart updated Successfully",
            cartItem: cartItem
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
        const cartItem = await CartModal.findByIdAndDelete(req.body._id)
        return res.json({
            Httpcode: 200,
            Message: "CartItem deleted Successfully",
            cartItem: cartItem
        })


    } catch (error) {
        return res.json({ error: error.message })
    }
})


module.exports = router