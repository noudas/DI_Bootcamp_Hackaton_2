const { Router } = require("express");

const {
    getAllCats,
    getAllWordsInCat,
    addNewCat,
    deleteCat,
} = require('../controllers/catControllers.js')

const router = Router();

// get everything form categories
router.get("/", getAllCats)

// get all <category> words
router.get("/:category", getAllWordsInCat )

// add new category
router.post("/", addNewCat)

// delete category
router.delete("/:category", deleteCat)

module.exports = {
    catRouter: router,
};
