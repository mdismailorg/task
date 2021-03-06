const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
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
    }
});
module.exports = mongoose.model("Cart", cartSchema);
