const express = require("express");
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const router = express.Router();
const bcrypt = require('bcrypt')
const ProductModal = require('../models/ProductsModal');
const CartModal = require('../models/CartModal');
const CheckOutModal = require('../models/CheckOutModal');
const auth = require("../auth");

router.post('/', auth, async (req, res) => {
    try {
        if (req.body.customerId) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Max-Age", "1800");
            res.setHeader("Access-Control-Allow-Headers", "content-type");
            res.setHeader(
                "Access-Control-Allow-Methods",
                "PUT, POST, GET, DELETE, PATCH, OPTIONS"
            );
            const cart = await CartModal.find({ customerId: req.body.customerId })
            const groupId = md5(Math.random())
            await cart.map(async (cartItem) => {
                const product = await ProductModal.findById(productId)
                const subTotal = product.amout * cartItem.quantity
                const checkout = new CheckOutModal({
                    customerId: cartItem.customerId,
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                    subTotal: subTotal,
                    orderStatus: false,
                    group: groupId
                })
                await checkout.save((err, result) => {
                    if (err) {
                        return res.json(err)
                    }
                })
            })
            return res.json({
                Httpcode: 200,
                groupId: groupId,
                Message: "Products Checked Out Successfully"
            })




        } else {
            return res.json({ error: "Customer Id is null" })
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