import multer from "multer"
import path from "path"

// after uploading data into localstorage(here public folder in backend)
// cloudinary picks up these files from public folder and we will clear this folder
// Multer acts as a bridge: it parses the file upload, saves it to disk, and attaches info to req.file.
// Your controller then processes the file (uploads to Cloudinary, updates DB).
// Without Multer, Express cannot handle file uploads natively.

let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(process.cwd(), "public"))
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    },

})

const upload = multer({ storage: storage })

export default upload;