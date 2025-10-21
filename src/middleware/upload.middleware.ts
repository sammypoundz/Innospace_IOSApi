import multer from "multer";
import path from "path";
import fs from "fs";

// ✅ Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅ Configure multer storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// ✅ Allowed file extensions
const allowed = [".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx"];

const fileFilter = (_req: any, file: Express.Multer.File, cb: any) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowed.includes(ext)) {
    return cb(
      new Error(
        "Invalid file type. Only images, PDFs, and Word documents (.doc, .docx) are allowed."
      ),
      false
    );
  }
  cb(null, true);
};

// ✅ Initialize Multer
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
});
