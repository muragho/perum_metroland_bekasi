const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const helmet = require('helmet');
const dotenv = require("dotenv");
const path = require("path");
const fileURLToPath = require("url");
const bodyParser = require("body-parser");
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const fs = require('fs');

dotenv.config();

const root = require('./controllers/General.beranda.controller.js');
//front end
const f_beranda = require('./routes/Beranda.route.js');
const f_cluster = require('./routes/Cluster.route.js');
const f_news = require('./routes/News.route.js');
const f_product = require('./routes/Product.route.js')
const f_about = require('./routes/AboutMe.route.js');
const f_location = require('./routes/Location.route.js');
const f_carrier = require('./routes/Carrier.route.js');


// routes
const auth = require('./routes/admin/Auth.route.js');
const isLogin = require('./middlewares/LoginCheck.js');
const homes = require('./routes/admin/Home.route.js');
const products = require('./routes/admin/Product.route.js');
const clusters = require('./routes/admin/Cluster.route.js');
const news = require('./routes/admin/News.route.js');
const config = require('./routes/admin/Config.route.js');
const user = require('./routes/admin/User.route.js');
const karir = require('./routes/admin/Carrier.route.js');
const facility = require('./routes/admin/Facility.route.js');
const access = require('./routes/admin/Access.route.js');
const errorHandler = require("./middlewares/ErrorHandler.js");

const app = express();
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

app.use(express.json());
console.log("__dirname : " + __dirname)
app.use(express.static(path.join(__dirname, "./public")));
// app.use(helmet());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.disable("x-powered-by");
app.set("view engine", "ejs");
app.use(cookieParser());

app.use(
    session({
        secret: process.env.SESS_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
            secure: true,
            httpOnly: true,
            sameSite: "Lax",
        },
    })
);

// pp.use(flash());

app.use(function (req, res, next) {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    next();
});

//front end
// app.use('/', root.berandaPage);
app.use(f_beranda);
app.use(f_cluster);
app.use(f_news);
app.use(f_product);
app.use(f_about);
app.use(f_location);
app.use(f_carrier);


// web admin
app.use('/auth', auth);
app.use(isLogin);
app.use('/auth', homes);
app.use('/auth', products);
app.use('/auth', clusters);
app.use('/auth', news);
app.use('/auth', config);
app.use('/auth', user);
app.use('/auth', karir);
app.use('/auth', facility);
app.use('/auth', access);

app.post('/auth/news/upload', multipartMiddleware, (req, res) => {

    fs.readFile(req.files.upload.path, function (err, data) {
        var newPath = __dirname + '/public/metroland/assets/image_news/' + req.files.upload.name;
        fs.writeFile(newPath, data, function (err) {
            if (err) console.log({ err: err });
        });
        res.status(200).send({ filename: req.files.upload.name, uploaded: 1, url: '/metroland/assets/image_news/' + req.files.upload.name })
    });

});
app.post('/auth/about/upload', multipartMiddleware, (req, res) => {

    fs.readFile(req.files.upload.path, function (err, data) {
        var newPath = __dirname + '/public/metroland/assets/about/' + req.files.upload.name;
        fs.writeFile(newPath, data, function (err) {
            if (err) console.log({ err: err });
        });
        res.status(200).send({ filename: req.files.upload.name, uploaded: 1, url: '/metroland/assets/about/' + req.files.upload.name })
    });

});


app.use(errorHandler)

// api routes
// app.use(api_current_user);

// app.use((req, res) => {
//     res.status(404).render("404/index");
// })

// app.use((req, res) => {
//     res.status(403).render("forbidden/index");
// })

// app.use((req, res) => {
//     res.status(500).render("internalservererror/index");
// })

const port = process.env.MY_PORT || 3000;
app.listen(port, () => {
    console.log("app running on port..." + port);
});