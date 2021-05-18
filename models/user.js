const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var user = new Schema({
    name: String,
    password: String,
    my_worlds: Array,
    current_login_token: String
});

module.exports = mongoose.model("users", user);