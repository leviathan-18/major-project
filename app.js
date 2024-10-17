if(process.env.NODE_ENV  !="production")
{
    require("dotenv").config();
}

const express =require("express");
const app =express();
const mongoose = require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate =require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const listingRouter=require("../airbnb-project/routes/listing.js");
const reviewRouter=require("../airbnb-project/routes/review.js");
const userRouter=require("../airbnb-project/routes/user.js");



const dbURL=process.env.ATLASDB_URL;

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbURL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json());

const store=MongoStore.create({
    mongoUrl:dbURL,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*60*60,
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*100,
        httpOnly:true,
    }
};

/*app.get("/",(req,res)=>{
    res.send("HII ! I AM ROOT");
});*/



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
});

/*app.get("/demouser",async(req,res)=>{
    let fakeUser=new User({
        email:"student@gmail.com",
        username:"delta-student",
    });
    let registeredUser = await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
})*/

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not found"));
})

/*app.use((err,req,res,next)=>{
    //console.log(err);
    //res.status(500).send("Internal Server Error");
    let{statusCode,message}=err;
    res.status(statusCode).render("error.ejs",{err});
    //res.status(statusCode).send(message);
    next();
})*/

app.use((err, req, res) => {
    console.error(err); // Log the error for debugging
    const statusCode = err.statusCode || 500; // Default to 500 if statusCode is not set
    const message = err.message || "Internal Server Error"; // Default message

    res.status(statusCode).render("error.ejs", { err: { message, statusCode } });
});

app.listen(8080,()=>{
    console.log("server is listening to port");
});
