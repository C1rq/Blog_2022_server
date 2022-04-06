const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middleware/admin/auth.middleware")

const followController = require("../controller/follow")


router.post('/:username',authMiddleware,followController.follow)
router.delete('/:username',authMiddleware,followController.cancelFollow)
router.get('/:username',authMiddleware,followController.showFollowers)





module.exports = router;