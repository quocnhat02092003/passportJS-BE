import {User} from "../models/user.model.js";
import bcrypt from "bcrypt"


const register = async (req, res) => {
  const { username, password, name } = req.body;
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.send({ success: false, message: "Username này đã tồn tại" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    var userInput = new User({
      username,
      password:hashPassword,
      name, 
    });

    await userInput.save();
    await res.send({ success: true, data: userInput });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
};


export default register




