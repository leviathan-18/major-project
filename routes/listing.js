const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner}=require("../middleware.js");
const listingController=require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload =multer({storage});


//new route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/")
.get(wrapAsync(listingController.index))
.post(
//validateListing,
isLoggedIn,
upload.single('listing[image]'),
wrapAsync(listingController.createListing));


router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    // validateListing,
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
     wrapAsync(listingController.updateListing))
.delete(
    isOwner,
    isLoggedIn,
    wrapAsync(listingController.destroyListing));
    



//edit route
router.get("/:id/edit",
    isOwner,
    isLoggedIn,wrapAsync(listingController.renderEditForm));



module.exports =router;