const userModel = require('../models/userModel')
const jwt = require("jsonwebtoken");
const validateBody = require('../validation/validation');

const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        let usercred = await userModel.findOne({ email: email, password: password });
        if (!usercred) {
            return res.status(400).send({ status: "false", msg: "The given credential is not match" });
        }
        else {
            let payload = { _id: usercred._id };
            let token = jwt.sign(payload, "radium", { expiresIn: '30m' });//Token creation and and set expiry time
           return res.status(200).send({ status: "True",usercred, token: token });
        }
    }
    catch (err) {
       return res.status(500).send({ status: false, msg: err.message });
    }
}
module.exports.logIn = logIn;