const router = require("express").Router();
const User = require("../models/user.js");
const {v4: uuidv4} = require("uuid");


router.post("/", async (req, res) => {
    var name = req.body.uid;
    var password = req.body.pwd;

    var user = await User.findOne({name: name, password: password});
    let current_login_token = uuidv4();

    if (user) {
        res.cookie("login_token", current_login_token);
        user.current_login_token = current_login_token;
        user.save();
        res.redirect("/menu");
    } else {        
        res.redirect("/");
    }
});



module.exports = router;