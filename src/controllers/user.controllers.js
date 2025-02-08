import { asyncHandeler } from "../utils/asyncHandeler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
const registerUser = asyncHandeler(async (req, res) => {
  //get user details from frontend
  //validation - not empty
  //check if user already exists :- username,email
  //check for images ,check for avtar
  //upload them to cloudinary
  //create user object - create entry in db
  //remove password and refresh token fields from response
  // check for user creation
  //return res

  const { fullName, email, username, password } = req.body;
  //console.log("email:", email);

  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fiels are required");
  }
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });


  if (existedUser) {
    throw new ApiError(409, "user with email or username");
  }
  //console.log(req.files);
  

  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path;
   
   let coverImageLocalPath;
   if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path
   }


  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file is required");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }


   
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }



  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered succefully"));
});

export { registerUser };




// {
//   avatar: [
//     {
//       fieldname: 'avatar',
//       originalname: 'img1.jpg',
//       encoding: '7bit',
//       mimetype: 'image/jpeg',
//       destination: './public/temp',
//       filename: 'img1.jpg',
//       path: 'public\\temp\\img1.jpg',
//       size: 292518
//     }
//   ],
//   coverImage: [
//     {
//       fieldname: 'coverImage',
//       originalname: 'Screenshot 2025-01-05 001818.png',
//       encoding: '7bit',
//       mimetype: 'image/png',
//       destination: './public/temp',
//       filename: 'Screenshot 2025-01-05 001818.png',
//       path: 'public\\temp\\Screenshot 2025-01-05 001818.png',
//       size: 372271
//     }
//   ]
// }


//in postman
// {
//   "statusCode": 200,
//   "data": {
//       "_id": "67a6f660389f4f5162f1fb1c",
//       "username": "patidar",
//       "email": "2v@patidar.com",
//       "fullName": "vinay2",
//       "avatar": "http://res.cloudinary.com/dkk0wiceg/image/upload/v1738995294/mrlylecz4dklrtlxhfjq.jpg",
//       "coverImage": "http://res.cloudinary.com/dkk0wiceg/image/upload/v1738995298/vb5vty0ywbqcwache2w0.png",
//       "watchHistory": [],
//       "createdAt": "2025-02-08T06:14:56.897Z",
//       "updatedAt": "2025-02-08T06:14:56.897Z",
//       "__v": 0
//   },
//   "message": "user registered succefully",
//   "success": true
// }