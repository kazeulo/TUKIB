const multer = require('multer');
const path = require('path');

// Define the uploads folder path
const uploadPath = path.join(__dirname, '..', '../uploads');

// Allowed file types for images
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
const fs = require('fs');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = path.join(__dirname, '../../uploads/', file.fieldname);
        if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
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
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB per file limit
}).fields([
    { name: 'proofOfFunds', maxCount: 1 },
    { name: 'paymentConforme', maxCount: 1 },
    { name: 'necessaryDocuments', maxCount: 5 }
]);

module.exports = upload;