/**
 * Requests for albums
 */
const express = require("express");
const router = express.Router();
const albumController = require("../controllers/album_controller");
const validateJwt = require("../middlewares/auth");
const validateAlbum = require("../validation/album");

router.use(validateJwt.validateJwtToken);

// GET all albums (view all)
router.get("/", albumController.show);

// GET specifik album with id (view one)
router.get("/:albumId", albumController.get);

// POST an album (create new)
router.post("/", validateAlbum.uploadRules, albumController.upload);

// PUT an album (update an album)
router.put("/:albumId", validateAlbum.updateRules, albumController.update);

// POST photo to an album (add photo)
router.post(
  "/:albumId/photos",
  validateAlbum.addPhoto,
  albumController.uploadPhoto
);

// POST multiple photos to album (add many photos) VG
router.post("/:albumId/photos", albumController.uploadManyPhotos);

// DELETE photo from album VG
router.delete("/:albumId/photos/:photoId", albumController.destroyPhoto);

// DELETE an album VG
router.delete("/:albumId", albumController.destroy);

module.exports = router;
