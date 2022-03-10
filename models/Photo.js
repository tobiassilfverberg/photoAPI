/**
 * Photo model
 */

module.exports = (bookshelf) => {
  return bookshelf.model("Photo", {
    tableName: "photos",
    users() {
      return this.belongsTo("User");
    },
    albums() {
      return this.belongsToMany("Album");
    },
  });
};
