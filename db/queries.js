//import { prisma } from '../lib/prisma.js' //ESM format
const { prisma } = require('../lib/prisma.js') //CJS format

/*
findUsername()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
*/

async function getUser(userId) {
  return await prisma.user.findUnique({
    where: {id: userId}
  })
}

async function createNewUser(username, displayName, password) {
  return await prisma.user.create({
    data: {
      name: displayName,
      username: username,
      password: password
    }
  })
}

async function postContent(newPost, userId) {
  return await prisma.post.create({
    data: {
      authorId: userId,
      content: newPost
    }
  })
}

async function postComment(newComment, statusId, userId) {
  return await prisma.comment.create({
    data: {
      authorId: userId,
      body: newComment,
      postId: statusId
    }
  })
}

async function retrieveAllPosts() {
  return await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          profilePic: true,
        }
      },
      comments: true
    },
    orderBy: {createdAt: 'desc'}
  })
}

async function retrieveSinglePost(statusId) {
  return await prisma.post.findUnique({
    where: {id: statusId},
    include: {
      author: {
        select: {
          id: true,
          name: true,
          username: true,
          profilePic: true,
        }
      },
      comments: true
    },
  })
}

async function retrieveComments(statusId) {
  return await prisma.comment.findMany({
    where: {postId: statusId},
    include: {author: true},
    orderBy: {createdAt: 'asc'}
  })
}

async function updateUserImage(userId, newImageUrl) {
  return await prisma.user.update({
    where: {id: userId},
    data: {
      profilePic: newImageUrl
    }
  })
}

async function updateUserBio(userId, newBio) {
  return await prisma.user.update({
    where: {id: userId},
    data: {
      bio: newBio
    }
  })  
}

async function updateUserWebsite(userId, newWebsite) {
  return await prisma.user.update({
    where: {id: userId},
    data: {
      website: newWebsite
    }
  })  
}

async function retrieveLike(postId) {
  return await prisma.like.findMany({
    where: {
      postId: postId,
    }
  })
}

async function addLike(postId, userId) {
  return await prisma.like.create({
    data: {
      postId: postId,
      authorId: userId
    }
  })  
}

async function deleteLike(postId, userId) {
  return await prisma.like.deleteMany({
    where: {
      postId: postId,
      authorId: userId
    }
  })  
}

async function getAccount(accountId) {
  return await prisma.user.findUnique({
    where: {id: accountId},
    select: {
      name: true,
      username: true,
      profilePic: true,
      bio: true,
      website: true
    }
  })
}

async function retrieveFollowers(accountId) {
  return await prisma.follow.findMany({
    where: {followedById: accountId}
  })
}

async function retrieveFollowing(accountId) {
  return await prisma.follow.findMany({
    where: {followingId: accountId}
  })
}

async function addFollow(userId, accountId) {
  return await prisma.follow.create({
    data: {
      followedById: accountId,
      followingId: userId
    }
  })
}

async function deleteFollow(userId, accountId) {
  return await prisma.follow.deleteMany({
    where: {
      followedById: accountId,
      followingId: userId
    }
  })  
}

async function getAllLatestUsers() {
  return await prisma.user.findMany({
    take: 3,
    select: {
      id: true,
      name: true,
      username: true,
      profilePic: true,
    },
    orderBy:{createdAt: 'desc'}
  })
}

module.exports = {
  getUser,
  createNewUser,
  postContent,
  postComment,
  retrieveAllPosts,
  retrieveSinglePost,
  retrieveComments,
  updateUserImage,
  updateUserBio,
  updateUserWebsite,
  retrieveLike,
  addLike,
  deleteLike,
  getAccount,
  retrieveFollowers,
  retrieveFollowing,
  addFollow,
  deleteFollow,
  getAllLatestUsers,
}