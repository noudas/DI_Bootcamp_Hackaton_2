const { Router } = require("express");

const {
    getAllCats,
    getAllWordsInCat,
    addNewCat,
    deleteCat,
} = require('../controllers/catControllers.js')

const router = Router();

// get everything form categories
router.get("/api/categories", getAllCats)

// get all <category> words
router.get("/api/categories/:category", getAllWordsInCat )

// add new category
router.post("/api/categories", addNewCat)

// delete category
router.delete("/api/categories/:category", deleteCat)

module.exports = {
    catRouter: router,
};
