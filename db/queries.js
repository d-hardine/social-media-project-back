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

async function duplicateUsernameSearch(inputtedUsername) {
  return await prisma.user.findUnique({
    where: {username: inputtedUsername}
  })
}

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

async function postContent(newPost, userId, newImageUrl) {
  return await prisma.post.create({
    data: {
      authorId: userId,
      content: newPost,
      image: newImageUrl
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

async function retrieveFollowingPosts(followingArray) {
  return await prisma.post.findMany({
    where: {authorId: {in: followingArray}},
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

async function retrieveAccountPosts(accountId) {
  return await prisma.post.findMany({
    where: {authorId: accountId},
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

async function updateUserDisplayedName(userId, newDisplayedName) {
  return await prisma.user.update({
    where: {id: userId},
    data: {
      name: newDisplayedName
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

async function getAllLatestUsers(userId) {
  return await prisma.user.findMany({
    where: {id: {not: userId}},
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

async function retrieveConversations(userId) {
  return await prisma.conversation.findMany({
    where: { members: {some: {userId: userId}} },
    include: {
      members: {
        where: {
          userId: {not: userId} //exclude the logged in user duh
        },
        include: {user: {select: {name: true, username: true, profilePic: true}}}
      }
    }
  })
}

async function retrieveMessages(conversationId) {
  return await prisma.messages.findMany({
    where: { conversationId },
    include: {sender: {select: {name: true, username: true, profilePic: true}}}
  })
}

async function retrieveConversationMembers(conversationId, userId) {
  return await prisma.conversationMembers.findMany({
    where: {conversationId, userId: {not: userId}},
    include: {user: {select: {name: true, username: true, profilePic: true}}}
  })
}

async function newMessage(conversationId, senderId, content) {
  return await prisma.messages.create({
    data: {
      conversationId,
      senderId,
      content
    },
    include: { sender: { select: { username: true } } } // Include sender info for UI 
  })
}

async function updateLastMessageConversation(conversationId, content) {
  return await prisma.conversation.update({
    where: {id: conversationId},
    data: {lastMessage: content}
  })
}

async function fetchExistingConversation(senderId, receiverId) {
  return await prisma.conversation.findFirst({
    where: {
      AND: [
        { members: { some: { userId: senderId } } },
        { members: { some: { userId: receiverId } } },
      ],
    },
    include: { members: true }
  })
}

async function newConversation(senderId, receiverId) {
  return await prisma.conversation.create({
    data: {
      members: {
        create: [
          { userId: senderId },
          { userId: receiverId }
        ]
      }
    },
    include: { members: true }
  })
}

module.exports = {
  duplicateUsernameSearch,
  getUser,
  createNewUser,
  postContent,
  postComment,
  retrieveAllPosts,
  retrieveFollowingPosts,
  retrieveAccountPosts,
  retrieveSinglePost,
  retrieveComments,
  updateUserImage,
  updateUserBio,
  updateUserWebsite,
  updateUserDisplayedName,
  retrieveLike,
  addLike,
  deleteLike,
  getAccount,
  retrieveFollowers,
  retrieveFollowing,
  addFollow,
  deleteFollow,
  getAllLatestUsers,
  retrieveConversations,
  retrieveMessages,
  retrieveConversationMembers,
  newMessage,
  updateLastMessageConversation,
  fetchExistingConversation,
  newConversation,
}