import { ApiError } from "../middleware/error.middleware";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/generateToken.js";

// create user account
export const createUserAccount = async (req, res) => {
  try {
    const { name, email, password, role='student'} = req.body;
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError("User already exists", 400);
    }
  
    const user = await User.create({ name, email, password, role });
  
    await user.updateLastActive();
  
    generateToken(res, user, "Account created successfully");
  
  
    return res.status(201).json({ user });
  } catch (error) {
    console.error("Error creating user account:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

}

// login user
export const authenticateUser = async (req, res) => {
  try{
    const {email, password} = req.body;

    const user = User.findOne({email}).select('+password');
    if(!user){
      throw new ApiError("User not found", 404);
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
      throw new ApiError("Invalid credentials", 401);
    }

    await user.updateLastActive();

    generateToken(res, user, `Welcome back ${user.name}`);
    return res.status(200).json({user});


  } catch(err) {
    console.error("Error authenticating user:", err);
    return res.status(500).json({error: "Internal server error - authenticate"});
  }
}

// sign out user
export const signOutUser = async (req, res) => {
  try{
    res.clearCookie('token');
    return res.status(200).json({
      success: true,
      message: "User signed out successfully"
    });
  } catch(err) {
    console.error("Error signing out user:", err);
    return res.status(500).json({error: "Internal server error - signout"});
  }
}

// get user profile
export const getUserProfile = async (req, res) => {
  try{
    // isAuthenticated middleware adds user to req object
    const user = req.user
      .populate({
        path: "enrolledCourses.course",
        select: "title thumbnail description"
      })
    
      if(!user){
        throw new ApiError("User not found", 404);
      }

    return res.status(200).json({user});

  } catch{
    console.error("Error getting user profile:", err);
    return res.status(500).json({error: "Internal server error - get profile"});
  }
}

export const test = async (req, res) => {
  try{

  } catch{
    
  }
}
