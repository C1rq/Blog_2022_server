const express = require("express")
const router = express.Router()
const {authMiddleware} = require("../middleware/admin/auth.middleware")


const FavoriteController = require("../controller/favorite")

router.post("/:slug",authMiddleware,FavoriteController.addFavorite)
router.delete("/:slug",authMiddleware,FavoriteController.cancelFavorite)

module.exports = router