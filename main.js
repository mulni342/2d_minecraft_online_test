const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server)
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const mongoose = require("mongoose");
const fs = require("fs");

// mongoose collection Object
var User = require("./models/user.js");

// opcion
app.use(express.static("public/dist"));
app.set("views", "views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());

io.on("connect", (socket) => {
    
});

app.get("/", async (req, res) => {

    let login_token = req.cookies.login_token;

    if (!login_token) {
        res.render("login.ejs");
    } else {
        let user = await User.findOne({current_login_token: login_token});
        if (!user) { res.render("login.ejs"); return; }

        res.redirect("/menu");
    }
});

app.get("/menu", async (req, res) => {
    let login_token = req.cookies.login_token;

    console.log("menu loaded!")

    if (login_token) {
        let user = await User.findOne({current_login_token: login_token});
        if (!user) { res.redirect("/"); return; }    
        var worlds_files = await fs.readdirSync(`./worlds/${user.name}`);
        
        var worlds = [];

        for (let i = 0; i < worlds_files.length; i++) {
            let wrdf = worlds_files[i];
            var world_info = JSON.parse(await fs.readFileSync(`./worlds/${user.name}/${wrdf}/world_info.json`));
            worlds.push({ id: wrdf, name: world_info.name, time_played: world_info.time_played });
        }
        
        res.render("menu", { name: user.name, login_token: login_token, worlds: worlds });
    } else { res.redirect("/"); }

})

app.use("/login", require("./routes/login.js"))
app.use("/game", require("./routes/game.js"))



var dburl = "mongodb://127.0.0.1:27017/minecraft_2d"
mongoose.connect(dburl, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => { server.listen(3001, console.log("page ONLINE IN PORT 3001!")); })

