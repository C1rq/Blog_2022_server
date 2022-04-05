const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middleware/admin/auth.middleware")

const userController = require("../controller/users")


router.post('/',userController.createUser)
router.post('/login',userController.login)
router.get('/',authMiddleware,userController.getUser)
router.patch('/',authMiddleware,userController.updateUser)   //patch 局部更新



module.exports = router;