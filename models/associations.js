const User = require('./Users')
const Post = require('./Posts')
const Follow = require('./Follow')

User.hasMany(Post, { as: 'posts', foreignKey: { name: 'userId', allowNull: false }, onDelete: 'CASCADE' })
Post.belongsTo(User, { as: 'author', foreignKey: { name: 'userId', allowNull: false } })

User.hasMany(Follow, { as: 'following', foreignKey: 'followerId', onDelete: 'CASCADE' })
User.hasMany(Follow, { as: 'followers', foreignKey: 'followedId', onDelete: 'CASCADE' })
Follow.belongsTo(User, { as: 'follower', foreignKey: 'followerId' })
Follow.belongsTo(User, { as: 'followed', foreignKey: 'followedId' })

module.exports = { User, Post, Follow }
