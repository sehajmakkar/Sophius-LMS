import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// check and load env variables
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadMedia = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return uploadResponse;
  } catch (error) {
    console.log("Error uploading media - Cloudinary:", error);
  }
};

export const deleteMedia = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log("Error deleting media - Cloudinary:", error);
  }
};

export const deleteVideo = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
  } catch (error) {
    console.log("Error deleting video - Cloudinary:", error);
  }
};
