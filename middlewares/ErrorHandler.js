const { NOT_FOUND, INTERNET_SERVER_ERROR, BAD_REQUEST, FORBIDDEN_ACCESS } = require("../helpers/ErrorCodes");
const AppError = require('../helpers/AppError.js');

const errorHandler = (error,req,res,next)=>{
    // return res.status(400).render("500/index");
    // return res.status(400).send("error");
    if(error instanceof AppError){
        
        switch(error.errorCode){
            case NOT_FOUND:
                res.status(NOT_FOUND).render("404/index");
                break;
            case INTERNET_SERVER_ERROR:
                console.log("masuk ke sini")
                res.status(INTERNET_SERVER_ERROR).render("500/index");
                break;
            case BAD_REQUEST:
                res.status(BAD_REQUEST).render("400/index");
                break;
            case FORBIDDEN_ACCESS:
                res.status(BAD_REQUEST).render("403/index");
                break;
        }
    }
    return res.status(200).render("500/index");
}

module.exports = errorHandler;