const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs').promises;
const {saveChatInstance, getAllInstances, getChatInstance, deleteChatInstance, uploadAIFile} = require('../controllers/aiChatController');
const multer = require('multer');

// Error handling middleware
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

const storage = multer.diskStorage({
    destination: async function (req, file, cb) {
      const uploadDir = path.join(__dirname, "uploads");
      try {
        await fs.mkdir(uploadDir, { recursive: true });
        cb(null, uploadDir);
      } catch (error) {
        cb(error);
      }
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
  
  const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === "application/pdf") {
        cb(null, true);
      } else {
        cb(new Error("Only PDF files are allowed"));
      }
    },
  });

router.post('/', saveChatInstance);
 router.get('/', getAllInstances);
 router.get('/:id', getChatInstance);
 router.delete('/:id', asyncHandler(deleteChatInstance));
 router.post('/:id/upload',upload.single('file'), uploadAIFile);


// router.post('/:id/chat', aiChatController.chat);
// router.post('/:id/history', aiChatController.history);
// router.post('/:id/documents', aiChatController.verifydocuments);

module.exports = router;