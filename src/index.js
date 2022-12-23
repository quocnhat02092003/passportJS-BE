import express from "express";
import connectDB from "./db/connectdb.js";
import router from "./routers/index.js";
import dotenv from "dotenv";
import cors from "cors";
import localStrategy from "passport-local";
import {User} from "./models/user.model.js";
import session from "express-session";
import bcrypt from "bcrypt"
import bodyParser from "body-parser";
import passport from "passport";
import cookieParser from 'cookie-parser'
// import { Server } from "socket.io";

// const io = new Server(5000,{
//   cors:{
//     origin: "http://localhost:3000",
//   credentials: true
//   }
// });

const app = express();

const port = process.env.PORT || 4000;

app.use(cors(
  {
  origin: "http://localhost:3000",
  credentials: true
}
));


dotenv.config();
connectDB();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}))
app.use(express.json())
app.use(
  session({
    secret: "secretcode",
    resave: true,
    saveUninitialized: true, 
    cookie:{
      httpOnly:false 
    }
  })
  );
  app.use(cookieParser())
  app.use(passport.initialize())
  app.use(passport.session());
  app.use(router);

passport.use('local',
new localStrategy( async (username, password, done) => {
  let userRecord = await User.findOne( {username});
  if (userRecord ===null){
    return done(null,false,{message:'Vui lòng nhập thông tin'} )
  }
  let checkedPassword =await bcrypt.compare(password, userRecord.password);
  if ( userRecord.username === username  && checkedPassword ===true) {
    return done(null, userRecord);
  } else {  
    return done(null, false,{message:'Sai tài khoản hoặc mật khẩu'} );
  }
})
);

passport.serializeUser(function(user, done) {
    return done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  const user = await User.findOne({_id: id});
  return done(null, user)
});
  



app.listen(4000, () => {
  console.log(`"App listening in port: ${port}"`);
});
