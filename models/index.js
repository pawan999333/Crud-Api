const User = require('./user');
const Post = require('./post');


User.hasMany(Post, { as: 'posts', foreignKey: 'userId' });
Post.belongsTo(User, { as: 'user', foreignKey: 'userId' });

module.exports = {User,Post};
