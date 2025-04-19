const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPath = path.join(__dirname, '..', 'uploads');


const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only .png, .jpg, .jpeg files are allowed'), false);
    }
    cb(null, true);
};

// Allowed file types for documents (PDFs)
const documentsFileFilter = (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
        return cb(new Error('Only .pdf files are allowed for documents'), false);
    }
    cb(null, true);
};

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Create a directory based on the field name 
        const folder = path.join(uploadPath, file.fieldname);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true }); 
        }
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const originalName = path.parse(file.originalname).name.replace(/\s+/g, '_'); // remove spaces
        const ext = path.extname(file.originalname);
        const newFileName = `${originalName}_${timestamp}${ext}`;
        cb(null, newFileName);
    }    
});

// Multer configuration for multiple fields
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Only PNG, JPG, JPEG, and PDF files are allowed'), false);
        }
        cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per file limit
}).fields([
    { name: 'proofOfFunds', maxCount: 1 },
    { name: 'paymentConforme', maxCount: 1 },
    { name: 'necessaryDocuments', maxCount: 5 }
]);

module.exports = upload;