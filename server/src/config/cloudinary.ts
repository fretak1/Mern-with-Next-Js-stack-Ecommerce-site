import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

// 👇 make sure env vars are loaded here too
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log("Cloudinary initialized ✅");
console.log("cloud_name:", process.env.CLOUDINARY_NAME);
console.log("api_key:", process.env.CLOUDINARY_API_KEY ? "Loaded" : "Missing");
console.log(
  "api_secret:",
  process.env.CLOUDINARY_API_SECRET ? "Loaded" : "Missing"
);

export default cloudinary;
