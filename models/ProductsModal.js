const mongoose = require("mongoose");

const productsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    amount: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    }
});
module.exports = mongoose.model("Products", productsSchema);
