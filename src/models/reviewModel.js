const mongoose = require("mongoose");
const objectId = mongoose.Types.ObjectId
const reviewSchema = new mongoose.Schema({
    bookId: {
        type: objectId,
        required: true,
        ref: "BookDetailsP4"
    },
    reviewedBy: {
        type: String,
        required: true,
        default: "Guest"
    },
    reviewedAt: {
        type: Date,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    review: {
        type: String
    },
    isDeleted:{
        type:Boolean,
        default:false
    }
})
module.exports = mongoose.model('reviewDetails', reviewSchema)