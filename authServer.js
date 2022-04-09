require('dotenv').config()

const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const CustomersModal = require('./models/CustomersModal')
const RefreshTokens = require('./models/RefreshTokens')

const mongoURL = `mongodb+srv://ismailismail:ismailismail@sample.jvejj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

app.use(express.json())

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const con = mongoose.connection

con.on('open', () => {
    console.log('connected');
})


app.post('/token', async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Max-Age", "1800");
        res.setHeader("Access-Control-Allow-Headers", "content-type");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "PUT, POST, GET, DELETE, PATCH, OPTIONS"
        );
        const refreshToken = req.body.refreshToken
        const accessToken = req.body.accessToken
        const refreshTokens = await RefreshTokens.find({ refreshToken: refreshToken })

        if (refreshToken == null) {
            return res.json({
                Httpcode: 401,
                Message: "Invalid Refresh Token"
            })
        }
        if (refreshTokens.length === 0) {
            return res.json({
                Httpcode: 401,
                Message: "Invalid Refresh Token"
            })
        }
        if (refreshTokens[0].refreshToken !== refreshToken) {
            return res.json({
                Httpcode: 401,
                Message: "Invalid Refresh Token"
            })
        }
        if (refreshTokens[0].accessToken !== accessToken) {
            return res.json({
                Httpcode: 401,
                Message: "Invalid Access Token"
            })
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
            delete user.iat
            console.log(user);
            const newaAcessToken = generateAccessToken(user)
            await RefreshTokens.findOneAndUpdate({ token: refreshToken }, { accessToken: newaAcessToken })
            return res.json({ accessToken: newaAcessToken })
        })
    } catch (error) {
        return res.json({
            Httpcode: 500,
            Message: error.message
        })
    }

})

app.delete('/logout', async (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Max-Age", "1800");
        res.setHeader("Access-Control-Allow-Headers", "content-type");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "PUT, POST, GET, DELETE, PATCH, OPTIONS"
        );
        const refreshToken = req.body.refreshToken
        await RefreshTokens.findOneAndRemove({ refreshToken: refreshToken })
        return res.json({ Httpcode: 204, Message: "LoggedOut Successfully" })
    } catch (error) {
        return res.json({
            Httpcode: 500,
            Message: error.message
        })
    }

})

app.post('/login', async (req, res) => {
    try {
        const customer = await CustomersModal.find({ email: req.body.email })
        console.log(customer);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.setHeader("Access-Control-Max-Age", "1800");
        res.setHeader("Access-Control-Allow-Headers", "content-type");
        res.setHeader(
            "Access-Control-Allow-Methods",
            "PUT, POST, GET, DELETE, PATCH, OPTIONS"
        );
        if (customer.length === 0) {
            return res.json({
                Httpcode: 404,
                Message: "User not found"
            })
        }
        if (await bcrypt.compare(req.body.password, customer[0].password)) {
            const userDetails = { name: customer[0].name, email: customer[0].email, phone: customer[0].phone }
            const accessToken = await generateAccessToken(userDetails)
            const refreshToken = jwt.sign(userDetails, process.env.REFRESH_TOKEN_SECRET)
            const refreshTokensModal = await new RefreshTokens({ refreshToken, accessToken })
            await refreshTokensModal.save();
            return res.json({
                Httpcode: 200,
                accessToken,
                refreshToken,
                Message: "Logged in Successfully",
            });
        } else {
            return res.json({
                Httpcode: 401,
                Message: "Wrong password",
            });
        }

    } catch (error) {
        return res.json({ error: error.message })
    }
})

const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1800s' })
}

app.listen(82, () => {
    console.log('Auth server listening');
})


