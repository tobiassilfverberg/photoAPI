/**
 * Photos controller
 */

const debug = require("debug")("photoAPI:photos_controller");
const { matchedData, validationResult } = require("express-validator");
const models = require("../models");

// Show all photos related to user
const show = async (req, res) => {
  // validate user
  const user = await models.User.fetchById(req.user.user_id, {
    withRelated: ["photos"],
  });

  try {
    const photos = await new models.Photo(user)
      .where("user_id", user.id)
      .fetchAll();

    res.send({
      status: "success",
      data: photos,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Couldn't get photos",
    });
  }
};

// Show book with id
const get = async (req, res) => {
  try {
    const photo = await new models.Photo()
      .where("id", req.params.photoId)
      .fetch();

    if (photo.get("user_id") !== req.user.user_id) {
      return res.status(401).send({
        status: "fail",
        message: "You are not authorized to show this photo",
      });
    }

    return res.send({
      status: "success",
      data: photo,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: "error",
      message: "Exception thrown in database when finding photo",
    });
  }
};

// Upload new photo
const upload = async (req, res) => {
  // get validated user
  const user = await models.User.fetchById(req.user.user_id, {
    withRelated: ["photos"],
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
    const result = await new models.Photo(validData).save();
    debug("Added photo to user successfully: %O", result);

    res.send({
      status: "success",
      data: result,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Exception thrown in database when adding a photo to a user.",
    });
    throw error;
  }
};

// Update photo
const update = async (req, res) => {
  // find photo
  const photo = await new models.Photo({ id: req.params.photoId }).fetch({
    require: false,
  });
  console.log(photo);

  // make sure this photo exists on user
  const user = await models.User.fetchById(req.user.user_id, {
    withRelated: ["photos"],
  });

  // deny if not
  if (!photo.get("user_id") === user.id) {
    debug("You don´t have access to this photo. %o", {
      id: req.params.photoId,
    });
    return res.status(403).send({
      status: "fail",
      data: "Update failed. You don't have access to this photo",
    });
  }

  if (!photo) {
    debug("Photo to update was not found. %o", { id: photoId });
    res.status(404).send({
      status: "fail",
      data: "Photo Not Found",
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
    const updatedPhoto = await photo.save(validData);
    debug("Updated photo successfully: %O", updatedPhoto);

    res.send({
      status: "success",
      data: updatedPhoto,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Exception thrown in database when updating a photo.",
    });
    throw error;
  }
};

// Delete photo with id
const destroy = async (req, res) => {
  const photoId = req.params.photoId;

  // get user
  const user = await models.User.fetchById(req.user.user_id, {
    withRelated: ["photos"],
  });

  // find photo
  const photo = await new models.Photo({ id: req.params.photoId }).fetch({
    require: false,
  });

  if (!photo) {
    debug("Photo to delete was not found. %o", { id: photoId });
    res.status(404).send({
      status: "fail",
      data: "Photo Not Found",
    });
    return;
  }

  if (!photo.get("user_id") === user.id) {
    debug("You don´t have access to this photo. %o", {
      id: req.params.photoId,
    });
    return res.status(403).send({
      status: "fail",
      data: "Update failed. You don't have access to this photo",
    });
  }

  try {
    const deletedPhoto = await photo.destroy();
    debug("Photo deleted successfully %o", deletedPhoto);
    res.send({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).send({
      status: "error",
      message: "Exception thrown in database when deleting a photo.",
    });
  }
};

module.exports = {
  show,
  get,
  upload,
  update,
  destroy,
};
