import express, { request, response } from "express";
import Passport from "passport";
import  register from "../controllers/user.controller.js";
import validate from "../middleware/validate.js";
import {Blog, User, Comment} from "../models/user.model.js";
import {CourseSchema, RegisterSchema } from "../schema/user.schema.js"; 
import bcrypt from "bcrypt"
import { Server } from "socket.io";
import e from "express";


//Setting socket with server
const io = new Server(5000,{
  cors:{ 
    origin: "http://localhost:3000", 
    credentials: true
  }
});


const router = express.Router(); 

//REGISTER
router.post("/register", validate(RegisterSchema), register);

//LOGIN
router.post(
  "/login",
  Passport.authenticate('local'),function (req,res){
    if(req.isAuthenticated()==true)
      return res.status(200).json({success:true,message:"Đăng nhập thành công", data: req.user})
  }
  )

//LOGOUT
  router.get("/logout", (req, res) => {
    req.logOut((err) => {
      if(err) throw err;
      res.status(200).clearCookie('connect.sid', {
        path: '/'
      });
      req.session.destroy(function (err) {
        return res.send({success:true,message:"Logout successfully"})
      });
    });
  })


//POST UPLOAD BLOG
router.post("/upload-blog",validate(CourseSchema),(req,res,next) => {
  try{
    // console.log(req.user)
  const UploadBlog = req.body;  
  const course = new Blog({...UploadBlog, 
  authorId: req.user._id
  })   
  course.save()
    return res.send({data:req.body,success:true})
  }
  catch{
    return res.send("Error")
  }
})

//GET ALL BLOG
router.get("/blogs",async function(req,res,next){
    const blog =await Blog.aggregate([{
      $lookup: {
        from: "comments",
        localField: "_id",
        foreignField: "commentId",
        as: "comments"
      }
    }])
      res.send(blog)
    })

    
//GET MY BLOGS
router.get("/my-blogs",async (req,res)=>{
  const authorId = req.user._id;
  const myBlogs = await Blog.find({
    authorId
  })
  return res.status(200).json({
    success:true,
    data: myBlogs
  })
})

//GET BLOG FOR EDIT
router.get("/getblog/edit/:id",async (req,res)=>{  
  const blogForEdit = await Blog.findOne({_id:req.params.id})
  res.json({data:blogForEdit,success:true}) 
}) 
 
//EDIT MY BLOGS  
router.put("/edit/:id",async (req,res)=>{ 
  await Blog.updateOne({_id:req.params.id},{titleblog:req.body.titleblog,contentblog:req.body.contentblog,author:req.body.author,imageblog:req.body.imageblog})
  res.send({
    success:true
  })
})  

//DELETE MY BLOGS
router.delete("/delete-blog/:id",async (req,res)=>{
  await Blog.findOneAndDelete({_id:req.params.id}) 
  return res.send({message:"Deleted thanh cong",success:true})  
}) 

 
//UPDATE ACCOUNT
router.post("/my-account/:id",async function(req,res,next){
  const Account = await User.findOne({id:req.params.id})
  const newUser = req.body
  let checkedPassword =await bcrypt.compare(newUser.password,Account.password);
  if (newUser.password && checkedPassword==true){
    if (newUser.password == newUser.newpassword){
      return res.send({success:false,message:"Mật khẩu cũ trùng mật khẩu mới, vui lòng đổi lại"})
    }
    else if (newUser.newpassword == newUser.confirmpassword){
      const hassNewPassword = await bcrypt.hash(newUser.confirmpassword,10)
      await User.findOneAndUpdate({id:req.params.id},{password:hassNewPassword})
      return res.send({message:"Password được thay đổi thành công",success:true})
    }
    else{
      return res.send({success:false})
    }
  }
  else{
    return res.send({success:false,message:"Password bị sai"})
  }
})

//POST COMMENT REALTIME
router.post("/comment/:id",async (req,res)=>{
  const comment = req.body;
  const Comments = new Comment({...comment,commentId:req.params.id})
  Comments.save()
  return res.send({success:true,message:req.body})
})

//SET SOCKET FOR REALTIME COMMENT
io.on("connection", (socket) => {
  socket.on("getComment",async (val)=>{
    const comment = new Comment({
      comment: val.message,
      commentId: val.id,
      commentUserId:val.nameId, 
      nameuser:val.nameUser
    })
    await comment.save() 
    io.emit("datagetcomment",val)
  })}
)


    
export default router
