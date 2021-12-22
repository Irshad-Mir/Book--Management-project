const validateBody = require('../validation/validation');
const userModel = require('../models/userModel')

//-------------This function will help to create the user and also checks the valid format of the email-----------
const createUser = async (req, res) => {
    try {
        let { email, password,title,phone,name,address } = req.body;//Using destructring to access the value of body
    
        if (!validateBody.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, msg: "Please provide body of intern" });
        }
        if (!validateBody.isValid(name)) {
            return res.status(400).send({ status: false, msg: "Please provide name or name field" });
        }
        if (!validateBody.isValid(title)) {
            return res.status(400).send({ status: false, msg: "Please provide title name or title field" });
        }
        if (!validateBody.isValid(phone)) {
            return res.status(400).send({ status: false, msg: "Please provide mobile number or mobile field" });
        }
        if (!validateBody.isValid(email)) {
            return res.status(400).send({ status: false, msg: "Please provide Email id or email field" });;
        }
        if (!validateBody.isValidSyntaxOfEmail(email)) {
            return res.status(404).send({ status: false, msg: "Please provide a valid Email Id" });
        }
        if(!validateBody.isValid(password)){
            return res.status(404).send({ status: false, msg: "Please provide password value" });
        }
        // if(!validateBody.isValidRequestBody(address)){
        //     return res.status(400).send({ status: false, msg: 'Please provide address key.' })
        // }
        if (!validateBody.isValidMobileNum(phone)) {
            return res.status(400).send({ status: false, msg: 'Please provide a valid Mobile number.' })
        }
        const validateEmail=await userModel.findOne({email:email})
        if(validateEmail){
           return res.status(400).send({status:false,msg:"This email Allready exists"});
        }
        password = password.trim();
        const len = password.length;
        if (len < 8 || len > 15) {
            res.status(400).send({ status: false, msg: "passord must be not be lessthan 8 or greater than 15" });
        }
        const user = req.body;
        let savedauthor = await userModel.create(user);
        res.status(201).send({ msg: savedauthor });
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}
module.exports.createUser = createUser
