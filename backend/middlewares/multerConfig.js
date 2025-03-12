const multer = require('multer');
const path = require('path');

// Define the uploads folder path
const uploadPath = path.join(__dirname, '..', '../uploads');

// Function to check file type for news images (accepts .png, .jpg)
const imageFileFilter = (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpg', 'image/jpeg'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only .png, .jpg, .jpeg files are allowed for news'), false);
    }
    cb(null, true);
};

// Function to check file type for service requests documents (accepts .pdf)
const documentsFileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Only .pdf files are allowed for documents'), false);
    }
    cb(null, true);
};

// Multer storage configurations for news images
const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(uploadPath, 'News')); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

// Multer storage configurations for service requests documents
const documentsStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(uploadPath, 'Documents')); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

// Create multer upload middleware for news
const uploadImage = multer({
    storage: imageStorage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, 
});

// Create multer upload middleware for service requests documents
const uploadDocuments = multer({
    storage: documentsStorage,
    fileFilter: documentsFileFilter,
    limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB file size limit
  }).array('necessaryDocuments', 5); 
  
module.exports = { uploadImage, uploadDocuments };