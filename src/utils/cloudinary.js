import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME , 
    api_key:process.env.CLOUDINARY_API_KEY , 
    api_secret:process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null
        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type:"auto"
        })
        //file has been uploaded sucessfully
        //console.log("file is uploaded on cloudinary ",response.url)
        fs.unlinkSync(localFilePath)
        return response;
        console.log(response);
        
       
        

        
    } catch (error) {
          fs.umlinkSync(localFilePath)            //remove loally upload temporary file as the upload operation failed
             return null;   
        }
}

export {uploadOnCloudinary}