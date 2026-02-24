const express = require("express");
const router = express.Router();
const controller = require("../controllers/product.controller");

router.post("/", controller.createProduct);
router.get("/", controller.getProducts);
router.get("/slug/:slug", controller.getBySlug);

module.exports = router;