var express = require('express');
var router = express.Router();

const multer = require("multer");
var path = require("path");
const crypto = require("crypto");

const userModel = require('./users');
const chatModel = require('./chatModel');
const localStrategy = require('passport-local');
const passport = require('passport');
const { default: axios } = require('axios');
const users = require('./users');
passport.use(new localStrategy(userModel.authenticate()));

// multer code....
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    crypto.randomBytes(14, function (err, buff) {
      const fn = buff.toString("hex") + path.extname(file.originalname)
      cb(null, fn);
    })

  }
})

const upload = multer({ storage: storage, fileFilter: fileFilter })

function fileFilter(req, file, cb) {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
    cb(null, true)
  }
  else {
    cb(new Error('jayda tez mt chal'), false)
  }
}

//for uploading cover photo of loggedInUser...
router.post("/uploadCover", upload.single("image"), (req, res) => {
  userModel.findOne({ username: req.session.passport.user }).then((loggedInuser) => {
    loggedInuser.cover_photo = req.file.filename;
    loggedInuser.save().then(() => {
      res.redirect("/profile");
    });
  });
});

//for uploading profile photo of loggedInUser...
router.post("/uploadProfile", upload.single("image"), (req, res) => {
  userModel.findOne({ username: req.session.passport.user }).then((loggedInuser) => {
    loggedInuser.profileimage = req.file.filename;
    loggedInuser.save().then(() => {
      res.redirect("/profile");
    });
  });
});

//for uploading posts of loggedInUser...
router.post("/uploadPost", upload.single("image"), async (req, res) => {
  const loggedInUser = await userModel.findOne({ username: req.session.passport.user });
  const description = req.body.description;
  const post = { post: req.file.filename, description: description };
  loggedInUser.posts.push(post);
  await loggedInUser.save();
  const redirectUrl = req.headers.referer.includes('/public') ? '/public' : '/profile';
  res.redirect(redirectUrl);
});

//for uploading stories of loggedInUser...

router.post("/uploadStory", upload.single("image"), async (req, res) => {
  const loggedInUser = await userModel.findOne({ username: req.session.passport.user });
  loggedInUser.story = req.file.filename; // Assuming req.file.filename contains the image filename as a string
  loggedInUser.storyTime = Date.now(); // Add a separate field to store the story timestamp
  loggedInUser.save();

  // Schedule deletion after 24 hours
  setTimeout(async () => {
    const user = await userModel.findOne({ username: req.session.passport.user });
    user.story = null;
    user.storyTime = null;
    user.save();
  },86400000);

  res.redirect('/public');
});












// all routes to ejs page..
router.get('/', function (req, res, next) {
  res.render('index');
});

// for login route.........
router.get('/login', function (req, res, next) {
  res.render('login');
});

// for register route.........
router.get('/register', function (req, res, next) {
  res.render('register');
});

// for profile route.........
router.get('/profile', isLoggedIn, async function (req, res, next) {
  const alluser = await userModel.find();
  const loggedInuser = await userModel.findOne({ username: req.session.passport.user });
  const allUserWithoutLoggedInUser = await userModel.find({ _id: { $nin: [loggedInuser._id] } });

  const friendsIds = loggedInuser.friends.friend.map(friend => friend._id);
  const friends = await userModel.find({ _id: friendsIds }).populate('friends.friend');

  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.json({ loggedInuser, alluser });
  } else {
    res.render('profile', { loggedInuser, friends, alluser, allUserWithoutLoggedInUser });
  }
});

// for freindsPage route.........
router.get('/freindsPage', async function (req, res, next) {
  var loggedInuser = await userModel.findOne({ username: req.session.passport.user });
  var alluser = await userModel.find({ _id: { $nin: [loggedInuser._id] } });

  var friendRequestsIds = loggedInuser.friends.friend_requests.map(request => request._id);
  var friendRequests = await userModel.find({ _id: friendRequestsIds }).populate('friends.friend_requests');;

  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.json({ loggedInuser, alluser });
  } else {
    res.render('freindsPage', { loggedInuser, alluser, friendRequests });
  }
});

// for public route.........
router.get('/public', async function (req, res, next) {
  const loggedInuser = await userModel.findOne({ username: req.session.passport.user });
  const allUserWithoutLoggedInUser = await userModel.find({ _id: { $nin: [loggedInuser._id] } });
  const alluser = await userModel.find();

  const friendRequestsIds = loggedInuser.friends.friend_requests.map(request => request._id);
  const friendRequests = await userModel.find({ _id: friendRequestsIds }).populate('friends.friend_requests');;

  const friendsIds = loggedInuser.friends.friend.map(friend => friend._id);
  const friends = await userModel.find({ _id: { $in: [...friendsIds, loggedInuser._id] } }).populate('friends.friend');
  const friends2 = await userModel.find({ _id: { $in: [...friendsIds] } }).populate('friends.friend');

  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.json({ loggedInuser });
  } else {
    res.render('public', { loggedInuser, friends, friends2, allUserWithoutLoggedInUser, friendRequests, alluser });
  }
});

// for userPage route.........
router.get('/userPage/:id', async function (req, res) {
  const loggedInuser = await userModel.findOne({ username: req.session.passport.user });
  const allUserWithoutLoggedInUser = await userModel.find({ _id: { $nin: [loggedInuser._id] } });
  const alluser = await userModel.find();
  const userId = req.params.id;
  const user = await userModel.findOne({ _id: userId });

  const friendsIds = user.friends.friend.map(friend => friend._id);
  const friends = await userModel.find({ _id: friendsIds }).populate('friends.friend');;


  if (userId == loggedInuser._id) {
    res.redirect('/profile');
  } else {
    res.render('userPage', { user, loggedInuser, friends, allUserWithoutLoggedInUser, alluser });
  }
});

// for bookmark route.........
router.get('/bookmark', async function (req, res) {
  const loggedInuser = await userModel.findOne({ username: req.session.passport.user });
  const alluser = await userModel.find();
  const bookmarkedPostIds = loggedInuser.bookmark;
  console.log(bookmarkedPostIds);

  const bookmarkedUsers = await userModel.find({ 'posts._id': { $in: bookmarkedPostIds } }).populate('posts.post');
  console.log(bookmarkedUsers);

  res.render('bookmark', { bookmarkedUsers, loggedInuser, alluser });
});

//for delete post....
router.get('/delete/:id', isLoggedIn, async function (req, res, next) {
  var loggedInuser = await userModel.findOne({ username: req.session.passport.user });
  await userModel.findOneAndUpdate(
    { _id: loggedInuser._id },
    { $pull: { posts: { _id: req.params.id } } }
  );
  res.json({ msg: "post deleted successfully" });
});

//for like the post...
router.get('/like/:id', async (req, res) => {
  const postId = req.params.id;

  const allUsers = await userModel.find();
  const post = allUsers.flatMap(user => user.posts).find(post => post._id.toString() === postId);

  // Find the user who made the like
  const loggedInUser = await userModel.findOne({ username: req.session.passport.user });

  // Check if the user has already liked the post
  if (post.likes.includes(loggedInUser._id)) {
    // Remove the like if already liked
    post.likes = post.likes.filter(userId => userId.toString() !== loggedInUser._id.toString());
  } else {
    // Add the like if not already liked
    post.likes.push(loggedInUser._id);
  }

  await Promise.all([...allUsers.map(user => user.save())]);

  const likeCount = post.likes.length;

  res.json({ likeCount, loggedInUser, post });
});

//for commenting on posts....
router.post('/comment/:id', async (req, res) => {
  const postId = req.params.id;
  const comment = req.body.comment;

  const allUsers = await userModel.find();
  const post = allUsers.flatMap(user => user.posts).find(post => post._id.toString() === postId);

  // Find the user who made the comment
  const loggedInUser = await userModel.findOne({ username: req.session.passport.user });

  // Add the comment to the post
  post.comment.push({ text: comment, user: loggedInUser.first_name, userpic: loggedInUser.profileimage });

  await Promise.all([loggedInUser.save(), ...allUsers.map(user => user.save())]);

  var commentCount = post.comment.length;
  var commentt = post.comment
  res.json({ commentCount, commentt });
});

//for creating or editing the bio of loggedInUser....
router.post("/editDetails", async function (req, res, next) {
  const loggedInUser = await userModel.findOne({ username: req.session.passport.user });

  const newBio = {
    bio: req.body.bio,
    college: req.body.college,
    school: req.body.school,
    living_place: req.body.living_place,
    location: req.body.location,
  };

  loggedInUser.newBio = [newBio]
  await loggedInUser.save();

  res.redirect('/profile');
});

// for sent freind request of the user....
router.get('/friends-request/:id', async function (req, res) {
  try {
    const loggedInUser = await userModel.findOne({ username: req.session.passport.user });
    const friendToBeAdded = await userModel.findOne({ _id: req.params.id });

    friendToBeAdded.friends.friend_requests.push(loggedInUser._id);

    await friendToBeAdded.save();

    res.json({ success: true, loggedInUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// for confirm freind request of the user....
router.get('/freinds/:id', async function (req, res) {
  try {
    const loggedInUser = await userModel.findOne({ username: req.session.passport.user });
    const whoSentRequest = await userModel.findOne({ _id: req.params.id });

    loggedInUser.friends.friend_requests.pop(whoSentRequest._id)
    loggedInUser.friends.friend.push(whoSentRequest._id);
    whoSentRequest.friends.friend.push(loggedInUser._id);

    await whoSentRequest.save();
    await loggedInUser.save();

    // Check the referer header to determine where the request was accepted from
    const referer = req.headers.referer;

    if (referer.includes('/public')) {
      res.redirect('/public');
    } else if (referer.includes('/freindsPage')) {
      res.redirect('/freindsPage');
    } else {
      res.redirect('/defaultPage');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }

});

// for delete freind request of the user....
router.get('/deleteFreindRequest/:id', async function (req, res) {
  try {
    const loggedInUser = await userModel.findOne({ username: req.session.passport.user });
    const whoSentRequest = await userModel.findOne({ _id: req.params.id });

    loggedInUser.friends.friend_requests.pop(whoSentRequest._id)

    await loggedInUser.save();

    const redirectUrl = req.headers.referer.includes('/public') ? '/public' : '/freindsPage';
    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    res.redirect("/freindsPage");
  }
});

// for unfriend....
router.get('/unfriends/:id', async function (req, res) {
  try {
    const loggedInUser = await userModel.findOne({ username: req.session.passport.user });
    const whoUnfriend = await userModel.findOne({ _id: req.params.id });
    const loggedInUserId = loggedInUser._id;
    const whoUnfriendId = whoUnfriend._id;

    loggedInUser.friends.friend = loggedInUser.friends.friend.filter(friendId => !friendId.equals(whoUnfriendId));
    whoUnfriend.friends.friend = whoUnfriend.friends.friend.filter(friendId => !friendId.equals(loggedInUserId));

    await loggedInUser.save();
    await whoUnfriend.save();

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

//for bookmarking the posts of all user for loggedInUser
router.get('/bookmarkPost/:id', async function (req, res) {
  const loggedInuser = await userModel.findOne({ username: req.session.passport.user });
  const postId = req.params.id;

  const bookmarkIndex = loggedInuser.bookmark.indexOf(postId);

  if (bookmarkIndex === -1) {
    loggedInuser.bookmark.push(postId);
  } else {
    loggedInuser.bookmark.splice(bookmarkIndex, 1);
  }

  await loggedInuser.save();

  res.json({ loggedInuser, msg: "post bookmarked successfully", msg2: "post Unbookmarked successfully" });
});

//for deleting all user....
router.get("/delete", async (req, res) => {
  await chatModel.deleteMany()
});

router.get('/chat', async function (req, res, next) {
  var loggedInuser = await userModel.findOne({ username: req.session.passport.user });
  var alluser = await userModel.find({ _id: { $nin: [loggedInuser._id] } });

  const friendsIds = loggedInuser.friends.friend.map(friend => friend._id);
  const friends = await userModel.find({ _id: { $in: [...friendsIds] } }).populate('friends.friend');

  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.json({ loggedInuser, alluser, friends });
  } else {
    res.render("chat", { loggedInuser, alluser, friends });
  }
});



router.post("/saveChat", async function (req, res, next) {
  var loggedInuser = await userModel.findOne({ username: req.session.passport.user });

  var chat = new chatModel({
    sender_id: req.body.sender_id,
    receiver_id: req.body.receiver_id,
    message: req.body.message
  })

  var newChat = await chat.save();
  console.log(newChat);
  res.send({ success: true, msg: 'chat inserted', data: { message: newChat.message }, loggedInuser })
});








//passport js routes for register and login user..
router.post('/register', function (req, res, next) {
  var data = new userModel({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    username: req.body.username,
    email: req.body.email,
    gender: req.body.gender,
    bYear: req.body.bYear,
    bDay: req.body.bDay,
    bMonth: req.body.bMonth
  })
  userModel.register(data, req.body.password)
    .then(function (createdUser) {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/profile')
      })
    })
    .catch(function (e) {
      res.send(e)
    })
});

router.post('/login', passport.authenticate('local',
  {
    successRedirect: '/public',
    failureRedirect: "/"
  }), function (req, res, next) { });

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    res.render('login');
  }
}

module.exports = router;