const mongoose = require("mongoose");

const refreshTokens = mongoose.Schema({
    refreshToken: {
        type: String,
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model("Refreshtokens", refreshTokens);
