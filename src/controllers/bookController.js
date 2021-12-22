const bookModel = require('../models/bookModel')
const userModel = require('../models/userModel')
const reviewModel = require('../models/reviewModel')
const validateBody = require('../validation/validation')

//-------------------Book creation-----------------------//
const bookCreation = async (req, res) => {
    try {

        const { title, excerpt, userId, ISBN, category, subcategory } = req.body//We are using destructring here to access the value of req body

        //--------------- Authrisation cheking going on--------------------//
        if (req.validate._id != userId) {
            return res.status(401).send({ status: false, msg: "User not Authorized" });
        }
        //--------------------End Authorization cheking------------//

        //----------------validation cheking going on------------------//
        if (!validateBody.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, msg: "Please provide body of book Details" });
        }
        if (!validateBody.isValid(title)) {
            return res.status(400).send({ status: false, msg: "Please provide title or name title" });
        }
        if (!validateBody.isValid(userId)) {
            return res.status(400).send({ status: false, msg: "Please provide user or name userid" });
        }

        if (!validateBody.isValid(excerpt)) {
            return res.status(400).send({ status: false, msg: "Please provide excerpt " });
        }
        if (!validateBody.isValid(ISBN)) {
            return res.status(400).send({ status: false, msg: "Please provide ISBN" });
        }
        if (!validateBody.isValid(category)) {
            return res.status(400).send({ status: false, msg: "Please provide category" });
        }
        if (!validateBody.isValid(subcategory)) {
            return res.status(400).send({ status: false, msg: "Please provide subcategory" });
        }
        //--------validation end------///

        //-----restict Duplicate entry of ISBN and TITLE-----////
        let findBooks = await bookModel.findOne({ title: title })
        if (findBooks) {
            return res.status(400).send({ status: false, msg: "This title is duplicate" });
        }
        let findBooks1 = await bookModel.findOne({ ISBN: ISBN });
        if (findBooks1) {
            return res.status(400).send({ status: false, msg: "This ISBN is duplicate" });
        }
        // -------------------------------END-----------------------------

        let data = req.body;
        let validId = await userModel.findById(userId);
        if (!validId) {
            return res.status(400).send({ msg: "The given Userid is INVALID" });
        }
        else {
            data.releasedAt = Date();
            let savedData = await bookModel.create(data)
            return res.status(201).send({ status: true, data: savedData });
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}
//-------Return filtered Book According to client----///
const returnFilteredBooks = async (req, res) => {
    try {
        let body = req.query;
        if (!Object.keys(body).length > 0) {
            return res.status(400).send({ status: false, msg: "Provide query body" });
        }
        body.isDeleted = false; //It sure that the book  is not deleted whisch client want to see
        let findBooks = await bookModel.find(body).select({ ISBN: 0, subcategory: 0, isDeleted: 0, deletedAt: 0 });
        if (!(findBooks.length > 0)) {

            res.status(404).send({ status: false, msg: "No documents found" });
        }

        //-------Sorting the titile in Dictionary Alphabetical order------------/////
        let sortingInAlphabetical = findBooks.sort(function (a, b) {
            return a.title.localeCompare(b.title);
        });
        ///------------------Sorting task is ended---------------------///////
        return res.status(200).send({ status: true, data: sortingInAlphabetical });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

//---Return bookDetails-----------------and Also review Details---------if BookId is provided by Client---///
const returnBookDetails = async (req, res) => {
    try {
        const id = req.params.code;
        let data = {}
        let validateId = await bookModel.findById(id);// finding the book by id In  our database
        if (!validateId) {
            res.status(404).send({ status: false, msg: "Provide valid BookId" });
        }
        if (validateId.isDeleted === true) {
            return res.status(400).send({ status: false, msg: "This book is no Longer Exists" });
        }
        const reviewData = await reviewModel.find({ bookId: id });//------Finding the review data Of particular book  ------
        data.validateId = validateId;
        data.reviewsData = reviewData;
        return res.status(200).send({ status: true, data });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

//------Update Book details according To client----//
const updateBookData = async (req, res) => {
    try {
        let bookId = req.params.code;
        let data = await bookModel.findOne({ _id: bookId });

        //--------Authrisation cheking---going on------//
        if (req.validate._id != data.userId) {
            return res.status(401).send({ status: false, msg: "User not Authorized" });
        }
        //--------------------Authrization End----------//

        if (!data) {
            return res.status(404).send({ status: false, msg: "Provide valid BookId" });
        }
        if (data.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "This book is no longer exists to Update" });
        }
        let update = req.body;
        if (Object.keys(update).length > 0) {
            if (update.title) {
                data.title = update.title;
            }
            if (update.excerpt) {
                data.excerpt = update.excerpt
            }
            if (update.releasedAt) {
                data.releasedAt = update.releasedAt;
            }
            if (update.ISBN) {
                data.ISBN = update.ISBN;
            }
            data.save();//saving all data what we changing in this controller
        }
        else {
            return res.status(404).send({ status: false, msg: "Please provide data to update" });
        }
        return res.status(200).send({ status: true, msg: "Succesfully Updated", data });
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }
}

//----------------Delete controller-------///----------//////
const deleteBook = async (req, res) => {
    try {
        const id = req.params.code;
        let data = await bookModel.findOne({ _id: id });
        if (!data) {
            return res.status(404).send({ status: false, msg: "Provide valid Id" });
        }

        ///----------Autherization cheking going on--------//
        if (req.validate._id != data.userId) {
            return res.status(401).send({ status: false, msg: "User not Authorized" });
        }
        //------Autherization cheking-----ends-----------//
        if (data.isDeleted === true) {
            return res.status(404).send({ status: false, msg: "This book is no longer Exists" });
        }
        data.isDeleted = true;
        data.save();   //Saving the changes what we have done
        return res.status(200).send({ status: true, msg: "successFully deleted", data });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}
module.exports = { deleteBook, updateBookData, returnBookDetails, returnFilteredBooks, bookCreation }