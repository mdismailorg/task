// const { config } = require("dotenv/types");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mongoose = require('mongoose')
const CustomersModal = require('./models/CustomersModal')
const RefreshTokens = require('./models/RefreshTokens')

module.exports = async (req, res, next) => {
    if (req.headers.authorization === undefined) {
        return res.json({
            Httpcode: 401,
            Message: "No token, Authorization denied",
        });
    } else {
        const token = req.headers.authorization.split(" ")[1];

        if (!token) {
            return res.json({
                Httpcode: 401,
                Message: "No token, Authorization denied",
            });
        }
        try {
            const accessToken = await RefreshTokens.find({ accessToken: token })
            if (accessToken.length === 0) {
                return res.json({
                    Httpcode: 401,
                    Message: "Invalid Token",
                })
            }
            const user = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.body = { ...req.body, user };
            next();
        } catch (error) {
            return res.json({
                Httpcode: 401,
                Message: "Token Expired",
            });
        }
    }
};
