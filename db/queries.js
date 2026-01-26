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
    include: {author: true},
    orderBy: {createdAt: 'desc'}
  })
}

async function retrieveSinglePost(statusId) {
  return await prisma.post.findUnique({
    where: {id: statusId},
    include: {author: true},
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
  updateUserWebsite
}