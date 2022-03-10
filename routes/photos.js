/**
 * Requests for photos
 */
const express = require("express");
const photosController = require("../controllers/photos_controller");
const router = express.Router();
const validateJwt = require("../middlewares/auth");
const validatePhoto = require("../validation/photo");

// router.use(validateJwt.validateJwtToken);
// GET all photos (show all)
router.get("/", photosController.show);

// GET single photo (show one)
router.get("/:photoId", photosController.get);

// POST a new photo (create new photo)
router.post("/", validatePhoto.uploadRules, photosController.upload);

// PUT a photo (update a photo)
router.put("/:photoId", validatePhoto.updateRules, photosController.update);

// DELETE a photo
router.delete("/:photoId", photosController.destroy);

module.exports = router;
