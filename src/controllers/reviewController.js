const bookModel = require('../models/bookModel');
const userModel = require('../models/userModel');
const reviewModel = require('../models/reviewModel');
const validateBody = require('../validation/validation');

//-----------Storing the review data in database--------//
const reviewDetails = async (req, res) => {
    try {
        const id = req.params.code;
        const data = await bookModel.findOne({ _id: id });
        if (!data) {
            return res.status(400).send({ status: false, msg: "Provide valid BookId" });
        }
        //-------Cheking this book is deleted or not---------/////
        if (data.isDeleted === true) {
            return res.status(400).send({ status: false, msg: "This book is no l0nger Exists for review" })
        }

        const { reviewedBy, review, rating } = req.body  //Destruring.....
        if (!validateBody.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, msg: "Please provide body of review Details" });
        }
        if (!validateBody.isValid(reviewedBy)) {
            return res.status(400).send({ status: false, msg: "Please provide reviewedBy field" });
        }
        if (!validateBody.isValid(rating)) {
            return res.status(400).send({ status: false, msg: "Please provide rating or rating field" });
        }

        let data1 = {}
        data1.bookId = id;
        data1.reviewedAt = Date();
        data1.reviewedBy = reviewedBy;
        data1.rating = rating;
        data1.review = review;
        data.reviews += 1;
        data.save();
        const savedData = await reviewModel.create(data1);
        const reviewData = await reviewModel.find({ bookId: id }).populate('bookId');
        return res.status(200).send({ status: true, msg: "successFul", reviewData });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}

//----------Update the review data according to the client-------//
const updateReview = async (req, res) => {
    try {
        const booksId = req.params.booksId;
        const reviewId = req.params.reviewId;
        const bookData = await bookModel.findOne({ _id: booksId });
        if (!bookData) {
            return res.status(404).send({ status: false, msg: "Provide valid BookId" });
        }
        if (bookData.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "This book is no longer Exists to update review"});
        }
        const reviewData = await reviewModel.findOne({ _id: reviewId });
        if (!reviewData) {
            return res.status(404).send({ status: false, msg: "provide valid reviewId" });
        }
        if (reviewData.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "This reviewData is no longer Exists" });
        }
        let update = req.body;
        if (Object.keys(update).length > 0) {
            if (update.review) {
                reviewData.review = update.review;
            }
            if (update.rating) {
                reviewData.rating = update.rating
            }
            if (update.reviewedBy) {
                reviewData.reviewedBy = update.reviewedBy;
            }
            reviewData.save();//saving all data what we changing in this controller
        }
        else {
            return res.status(404).send({ status: false, msg: "Please provide data to update" });
        }
        return res.status(400).send({ status: true, msg: "SuccessFully Updated", reviewData });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message });
    }
}
//=========Delete review DAta--------//
const deleteReview = async (req, res) => {
    try {
        const booksId = req.params.booksId;
        const reviewId = req.params.reviewId;
        const bookData = await bookModel.findOne({ _id: booksId });
        if (!bookData) {
            return res.status(404).send({ status: false, msg: "Provide valid BookId" });
        }
        if (bookData.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "This book is no longer Exists to delete its review" });
        }
        const reviewData = await reviewModel.findOne({ _id: reviewId });
        if (!reviewData) {
            return res.status(404).send({ status: false, msg: "provide valid reviewId" });
        }
        if (reviewData.isDeleted == true) {
            return res.status(404).send({ status: false, msg: "This reviewData is no longer Exists" });
        }
        
        reviewData.isDeleted = true;
        bookData.reviews -= 1;
        bookData.save();
        reviewData.save();
        return res.status(200).send({ status: true, msg: "SuccessFully Deleted" });

    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message });
    }

}
module.exports = { deleteReview, reviewDetails, updateReview, reviewDetails }