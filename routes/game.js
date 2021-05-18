var router = require("express").Router();
const fs = require("fs");
const User = require("../models/user.js");
const {v4: uuidv4} = require("uuid");


router.get("/world/:world_id", async (req, res) => {
    var world_id = req.params.world_id;
    let login_token = req.cookies.login_token;

    if (!login_token) res.redirect("/")
    let user = await User.findOne({current_login_token: login_token});
    if (!user) { res.redirect("/"); return; }    

    var worlds = await fs.readdirSync(`./worlds/${user.name}`);

    var world_gen_info = JSON.parse(await fs.readFileSync(`./worlds/${user.name}/${world_id}/world_generation.json`));

    if (worlds.includes(world_id)) {
        res.render("world", { world_gen_info: world_gen_info });
    } else {
        res.redirect("/menu");
    }
})



module.exports = router;
