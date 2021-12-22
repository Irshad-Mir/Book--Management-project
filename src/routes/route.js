const express = require('express');
const router = express.Router();

// these are controller and middelware imports.
const userController =require("../controllers/userController");
const loginController=require("../controllers/loginController");
const reviewController=require("../controllers/reviewController");
const bookController=require("../controllers/bookController");
const middleWare =require("../middlewares/middleware")
const AWS=require("../controllers/AWScontroller");

router.post("/user", userController.createUser);
router.post("/login",loginController.logIn);

//-----------------Aws-----------------------//////
router.post("/write-file-aws",AWS.Aws);

//---------------Book crud operation Api--------//
router.post("/book",middleWare.validation,bookController.bookCreation);
router.get("/getBook",middleWare.validation,bookController.returnFilteredBooks);
router.get("/getBookSpecific/id/:code",middleWare.validation,bookController.returnBookDetails);
router.put("/updateBook/:code",middleWare.validation,bookController.updateBookData);
router.delete("/deleteBook/:code",middleWare.validation,bookController.deleteBook);

//-----------Review---- CRUD---------OPeration Api-----//
router.post("/review/:code",reviewController.reviewDetails);
router.put("/updateReview/:booksId/:reviewId",reviewController.updateReview);
router.get("/deleteReview/:booksId/:reviewId",reviewController.deleteReview);


module.exports = router; 