const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middleware/admin/auth.middleware")
const tagController = require("../controller/tag")


router.post('/',authMiddleware,tagController.createTag)
router.get('/',tagController.getTags)





module.exports = router;