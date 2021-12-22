const jwt = require("jsonwebtoken");

//-----------This function help in decoding the token and authenticates the user-----------//---
const validation = async function (req, res, next) {
    try {
        let token = req.headers['x-api-key'];
        if(typeof token=='undefined' ||  token ==''){
            return res.status(400).send({status:false,msg:"please provide token headers"});
        }

        let validate = jwt.verify(token, "radium");
        
        if (validate) {
            req.validate = validate;
            next();
        }
        else {
            res.status(400).send({ status: "false", msg: "Token is invalid"});
        }
    }
    catch (err) {
        res.status(400).send({ msg:err.message });
    }
}
module.exports.validation = validation;
