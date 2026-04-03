import multer from "multer";

// Storage configuration (temporary storage in memory)
const storage = multer.memoryStorage();

// File filter (only allow PDF)
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true); // accept file
  } else {
    cb(new Error("Only PDF files are allowed"), false); // reject file
  }
};

// Multer configuration
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

export default upload;