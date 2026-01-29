import multer from "multer";

const storage = multer.memoryStorage();

// multer.js
export const singleUpload = multer({ storage }).single("profilePhoto");
