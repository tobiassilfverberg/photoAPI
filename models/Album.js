/**
 * Album model
 */

module.exports = (bookshelf) => {
  return bookshelf.model(
    "Album",
    {
      tableName: "albums",
      photos() {
        return this.belongsToMany("Photo");
      },
      users() {
        return this.belongsTo("User");
      },
    },
    {
      async fetchById(id, fetchOptions) {
        const user = await new this({ id }).fetch(fetchOptions);
        if (!user) {
          return false;
        }
        return user;
      },
    }
  );
};
