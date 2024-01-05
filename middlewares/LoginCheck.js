const jwt = require('jsonwebtoken');

function isLogin(req, res, next) {
    const token = req.cookies.metroAdmAcc;
    // const refreshToken = req.cookies.smartQ_Acc;
    if (token == "undefined" || token == null) {
        return res.redirect("/");
    } else {
        try {
            const bearer = jwt.verify(token, process.env.SIGNATURE);

            req.bearer = bearer;
            next();
        } catch (error) {
            console.error(error);
            return res.redirect("/auth")
        }

    }
}

function hasExpired(exp) {
    return Date.now() >= exp * 1000 ? true : false;
}

module.exports = isLogin