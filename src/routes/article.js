const express = require("express");
const router = express.Router();
const {authMiddleware} = require("../middleware/admin/auth.middleware")

const articleController = require("../controller/articles")


router.post('/',authMiddleware,articleController.createArticle)
router.get('/',authMiddleware,articleController.getArticles)
router.get('/follow',authMiddleware,articleController.getFollowArticle)
router.put('/:slug',authMiddleware,articleController.updateArticle)
router.delete('/:slug',authMiddleware,articleController.deleteArticle)
router.get('/:slug',authMiddleware,articleController.getArticle)



module.exports = router;
