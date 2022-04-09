const express = require("express");
const jwt = require('jsonwebtoken')
const md5 = require('md5')
const router = express.Router();
const bcrypt = require('bcrypt')
const ProductModal = require('../models/ProductsModal');
const OrdersModal = require('../models/OrdersModal');
const CheckOutModal = require('../models/CheckOutModal');
const auth = require("../auth");

router.post('/placeOrder', auth, async (req, res) => {
    try {
        if (req.body.customerId, req.body.groupId) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Max-Age", "1800");
            res.setHeader("Access-Control-Allow-Headers", "content-type");
            res.setHeader(
                "Access-Control-Allow-Methods",
                "PUT, POST, GET, DELETE, PATCH, OPTIONS"
            );
            const checkouts = await CheckOutModal.find({ groupId: req.body.groupId })
            let total = 0

            if (checkouts.length !== 0) {
                let loop = checkouts.map(async (checkoutItem) => {
                    await CheckOutModal.findByIdAndUpdate(checkoutItem._id, { orderStatus: true })
                    console.log(parseInt(checkoutItem.subTotal));
                    total = total + parseInt(checkoutItem.subTotal)
                })
                Promise.all(loop).then(async () => {
                    console.log(total);
                    const newOrder = await new OrdersModal({
                        customerId: req.body.customerId,
                        groupId: req.body.groupId,
                        total: total.toString()
                    })
                    await newOrder.save((err, result) => {
                        if (err) {
                            return res.json(err)
                        }
                        console.log(result);
                        return res.json({
                            Httpcode: 200,
                            orderId: result._id,
                            Message: "Order Palced Successfully"
                        })
                    })

                })

            } else {
                return res.json({
                    Httpcode: 201,
                    Message: "No Checkouts"
                })
            }






        } else {
            return res.json({ error: "Customer Id is null" })
        }
    } catch (error) {
        return res.json({ error: error.message })
    }
})

router.get('/reviewOrder', auth, async (req, res) => {
    try {
        if (req.query.orderId) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Max-Age", "1800");
            res.setHeader("Access-Control-Allow-Headers", "content-type");
            res.setHeader(
                "Access-Control-Allow-Methods",
                "PUT, POST, GET, DELETE, PATCH, OPTIONS"
            );
            let result = { products: [], totalAmount: 0 }
            const order = await OrdersModal.findById(req.query.orderId)
            const checkouts = await CheckOutModal.find({ groupId: order.groupId })

            if (checkouts.length !== 0) {
                let loop = checkouts.map(async (checkoutItem) => {
                    let productDetails = {}
                    const product = await ProductModal.findById(checkoutItem.productId)
                    productDetails.quantity = checkoutItem.quantity
                    productDetails.subTotal = checkoutItem.subTotal
                    productDetails.productName = product.name
                    productDetails.price = product.amount
                    result.totalAmount = result.totalAmount + parseInt(checkoutItem.subTotal)
                    result.products.push(productDetails)
                })
                Promise.all(loop).then(async () => {
                    return res.json({
                        Httpcode: 200,
                        orderDetails: result,
                    })

                })

            } else {
                return res.json({
                    Httpcode: 201,
                    Message: "No Checkouts"
                })
            }






        } else {
            return res.json({ error: "Order Id is null" })
        }
    } catch (error) {
        return res.json({ error: error.message })
    }
})

router.get('/getOrders', auth, async (req, res) => {
    try {
        if (req.query.customerId) {
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials", "true");
            res.setHeader("Access-Control-Max-Age", "1800");
            res.setHeader("Access-Control-Allow-Headers", "content-type");
            res.setHeader(
                "Access-Control-Allow-Methods",
                "PUT, POST, GET, DELETE, PATCH, OPTIONS"
            );
            const orders = await OrdersModal.find({ customerId: req.query.customerId })
            return res.json({
                Httpcode: 200,
                orders: orders,
            })
        }
        else {
            return res.json({ error: "Customer Id is null" })
        }
    }
    catch (error) {
        return res.json({ error: error.message })
    }
})
module.exports = router