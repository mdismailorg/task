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
                const product = await ProductModal.findById(cartItem.productId)
                const subTotal = parseInt(product.amount) * parseInt(cartItem.quantity)
                const checkout = new CheckOutModal({
                    customerId: cartItem.customerId,
                    productId: cartItem.productId,
                    quantity: cartItem.quantity,
                    subTotal: subTotal.toString(),
                    orderStatus: false,
                    group: groupId
                })
                await checkout.save((err, result) => {
                    if (err) {
                        console.log(err);
                        // return res.json(err)
                    }
                })
                await CartModal.findOneAndDelete({ customerId: cartItem.customerId })
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



module.exports = router