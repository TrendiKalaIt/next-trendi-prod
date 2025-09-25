const express = require('express');
const router = express.Router();
const { sendEnquiry } = require('../controllers/enquiryController');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/enquiries/send-enquiry
// image field ka naam frontend me 'image' hona chahiye
router.post('/send-enquiry', upload.single('image'), sendEnquiry);

module.exports = router;
