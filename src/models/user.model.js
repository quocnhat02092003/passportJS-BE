import mongoose from "mongoose";
import moment from "moment/moment.js";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minLenght: 8,
      maxLenght: 32,
      unique: true,
    },
    password: { type: String, required: true, minLenght: 8, maxLenght: 32 },
    name: {
      type: String,
      required: true,
      minLenght: 8,
      maxLenght: 32,
    },
    createdAt:{
      type:String,
      default:moment().format('h:mm:ss a, D MMMM YYYY')
    }
  }
  );
  
  const BlogSchema = mongoose.Schema(
  {
    titleblog:{
      type:String,
      required:true,      
    },
    imageblog:{
      type:String,
      required:true,
    },
    contentblog:{
      type:String,
      required:true
    },
    deleted:{
      type:Boolean,
      default:false
    },
    authorId: {
      type: mongoose.Types.ObjectId,
      required: true,
    },
    author:{ 
      type:String,
      // required:true
    },
    createdAt:{
      type:String,
      default:moment().format('h:mm:ss a, D MMMM YYYY')
    }
  },
    )
  const commentSchema = mongoose.Schema({
    comment:{
      type:String
    },
    commentId:{
      type:mongoose.Types.ObjectId
    },
    deleted:{
      type:Boolean,
      default:false
    },
    commentUserId:{
      type:String
    },
    nameuser:{
      type:String
    }
    ,
    createdAt:{
      type:String,
      default:moment().format('h:mm:ss a, D MMMM YYYY')
    }
  })
    

const User = mongoose.model("user", UserSchema)
const Blog = mongoose.model("blog",BlogSchema)
const Comment = mongoose.model("comment",commentSchema)
export {User,Blog,Comment};
 