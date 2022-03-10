/**
 * Album controller
 */

const debug = require("debug")("photoAPI:auth_controller");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

// Show all albums for this user
const show = async (req, res) => {
  const user = await models.User.fetchById(req.user.user_id, {
    withRelated: ["albums"],
  });

  try {
    const albums = await new models.Album(user)
      .where("user_id", user.id)
      .fetchAll();

    res.send({
      status: "success",
      data: albums,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Couldn't get albums",
    });
  }
};

// Show one album with id
const get = async (req, res) => {
  try {
    const album = await new models.Album()
      .where("id", req.params.albumId)
      .fetch();

    if (album.get("user_id") !== req.user.user_id) {
      return res.status(401).send({
        status: "fail",
        message: "You are not authorized to show this album",
      });
    }

    const albumToShow = await models.Album.fetchById(req.params.albumId, {
      withRelated: ["photos"],
    });

    return res.send({
      status: "success",
      data: albumToShow,
    });
  } catch (error) {
    return res.status(500).send({
      status: "error",
      message: "Exception thrown in database when finding album",
    });
  }
};

// Create album
const upload = async (req, res) => {
  // get validated user
  const user = await models.User.fetchById(req.user.user_id, {
    withRelated: ["albums"],
  });

  // check for any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: "fail", data: errors.array() });
  }

  // get only the validated data from the request
  const validData = matchedData(req);
  validData.user_id = user.id;

  try {
    const result = await new models.Album(validData).save();
    debug("Added album to user successfully: %O", result);

    res.send({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Exception thrown in database when adding an album to a user.",
    });
    throw error;
  }
};

// Update album
const update = async (req, res) => {
  // find album
  const album = await new models.Album({ id: req.params.albumId }).fetch({
    require: false,
  });
  console.log(album);

  // make sure this photo exists on user
  const user = await models.User.fetchById(req.user.user_id, {
    withRelated: ["albums"],
  });

  // deny if not
  if (!album.get("user_id") === user.id) {
    debug("You don´t have access to this album. %o", {
      id: req.params.albumId,
    });
    return res.status(403).send({
      status: "fail",
      data: "Update failed. You don't have access to this album",
    });
  }

  if (!album) {
    debug("Album to update was not found. %o", { id: albumId });
    res.status(404).send({
      status: "fail",
      data: "Album Not Found",
    });
    return;
  }

  // check for any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: "fail", data: errors.array() });
  }

  // get only the validated data from the request
  const validData = matchedData(req);

  try {
    const updatedAlbum = await album.save(validData);
    debug("Updated Album successfully: %O", updatedAlbum);

    res.send({
      status: "success",
      data: updatedAlbum,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Exception thrown in database when updating an album.",
    });
    throw error;
  }
};

// Upload photo to album
const uploadPhoto = async (req, res) => {
  // check for any validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).send({ status: "fail", data: errors.array() });
  }

  // get only the validated data from the request
  const validData = matchedData(req);

  const user = await models.User.fetchById(req.user.user_id, {
    withRelated: ["albums", "photos"],
  });

  const userAlbum = user
    .related("albums")
    .find((album) => album.id == req.params.albumId);

  const userPhoto = user
    .related("photos")
    .find((photo) => photo.id == validData.photo_id);

  const album = await models.Album.fetchById(req.params.albumId, {
    withRelated: ["photos"],
  });

  // check if album exists for user to add photo to
  const existing_photo = album
    .related("photos")
    .find((photo) => photo.id == validData.photo_id);

  // check if albumId exists
  if (!album) {
    debug("Album to update was not found. %o", { id: req.params.albumId });
    res.status(404).send({
      status: "fail",
      data: "Album Not Found",
    });
    return;
  }

  // Check if photo exists
  if (existing_photo) {
    return res.send({
      status: "fail",
      data: "Photo already exists",
    });
  }

  // Deny if album belongs to other user
  if (!userAlbum || !userPhoto) {
    debug("Cannot add photo to album you do not own. %o", {
      id: req.params.albumId,
    });
    res.status(403).send({
      status: "fail",
      data: "Action denied. This does photo does not belong to you!",
    });
    return;
  }

  try {
    const result = await album.photos().attach(validData.photo_id);
    debug("Added photo to album successfully: %O", result);

    res.send({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Exception thrown in database when adding a photo to an album.",
    });
    throw error;
  }
};

// Upload multiple photos to album VG
const uploadManyPhotos = async (req, res) => {};

// Delete one photo from album VG
const destroyPhoto = async (req, res) => {};

// Delete entire album VG
const destroy = async (req, res) => {};

module.exports = {
  show,
  get,
  upload,
  update,
  uploadPhoto,
  uploadManyPhotos,
  destroyPhoto,
  destroy,
};
