const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    customerId: {
        type: String,
        required: true
    },
    groupId: {
        type: String,
        required: true
    },
    total: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model("Orders", orderSchema);
