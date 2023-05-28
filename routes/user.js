const express = require("express");
const router = express.Router();

const User = require("../models/User");

const {login, signup, forgotPassword, updateProfile, getOrders, getAllOrders, orderStatusUpdate} = require("../Controllers/Auth");
const {auth,isAdmin} = require("../middlewares/auth");


router.post("/login", login);
router.post("/signup", signup);

//testing protected routes for single middleware
router.get("/test", auth, isAdmin, (req,res) =>{
    res.json({
        success:true,
        message:'Welcome to the Protected route for TESTS',
    });
});

router.post("/forgot-password" , forgotPassword)

//protected route

router.get("/user-auth",auth,(req,res)=>{
    res.status(200).send({ok:true})
})

router.get("/admin-auth",auth,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

router.put("/profile" ,auth, updateProfile)
// router.get("/checkout",auth,(req,res)=>{
//     res.status(200).send({ok:true})
// })

router.get("/orders" ,auth,getOrders)
router.get("/all-orders" ,auth,isAdmin,getAllOrders)


// sttaus udpadate

router.put("/order-status/:orderId" ,auth,isAdmin,orderStatusUpdate)



module.exports = router;