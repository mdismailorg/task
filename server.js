const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
require('dotenv').config()


const customerRouter = require('./routers/customerRouter')
const productRouter = require('./routers/productsRouter')
const CartRouter = require('./routers/cartRouter')
const CheckOutRouter = require('./routers/checkOutRouter')
const OrderRouter = require('./routers/ordersRouter')

const mongoURL = `mongodb+srv://ismailismail:ismailismail@sample.jvejj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`


const app = express()
app.use(express.json())

app.use('/customer', customerRouter)
app.use('/product', productRouter)
app.use('/cart', CartRouter)
app.use('/checkout', CheckOutRouter)
app.use('/order', OrderRouter)

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const con = mongoose.connection

con.on('open', () => {
    console.log('connected');
})




app.listen(81, () => {
    console.log('listening');
})