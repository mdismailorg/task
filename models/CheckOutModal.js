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
        type: String,
        required: true
    },
    subTotal: {
        type: String,
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
