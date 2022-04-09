const mongoose = require("mongoose");

const checkOutSchema = mongoose.Schema({
    customerId: {
        type: String,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    subTotal: {
        type: Number,
        required: true
    },
    group: {
        type: String,
        required: true
    },
    orderStatus: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model("CheckOut", checkOutSchema);
