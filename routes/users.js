var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');
// mongoose.connect("mongodb+srv://hdangi224:hdangi224@cluster0.gilhcih.mongodb.net/facebook-clone?retryWrites=true&w=majority");
mongoose.connect("mongodb://127.0.0.1:27017/fbclonefirse");


var userSchema = mongoose.Schema({
  first_name: {
    type: String,
    default: ""
  },
  last_name: {
    type: String,
    default: ""
  },
  username: {
    type: String,
    default: "",
    unique: true
  },
  email: {
    type: String,
    default: ""
  },
  password: {
    type: String,
    default: ""
  },
  profileimage: {
    type: String,
    default: ""
  },
  cover_photo: {
    type: String,
    default: ""
  },
  posts: [
    {
      post: {
        type: Array,
        default: []
      },
      description: {
        type: String,
        default: ""
      },
      date: {
        type: Date,
        default: Date.now()
      },
      likes: {
        type: Array,
        default: []
      },
      comment: {
        type: Array,
        default: []
      }
    }
  ],
  gender: {
    type: String,
    default: ""
  },
  bYear: {
    type: String,
    default: ""
  },
  bMonth: {
    type: String,
    default: ""
  },
  bDay: {
    type: String,
    default: ""
  },
  friends: {
    friend: {
      type: Array,
      default: []
    },
    friend_requests: {
      type: Array,
      default: []
    }
  },
  bookmark: {
    type: Array,
    default: []
  },
  newBio: [{
    bio: {
      type: String,
      default: ""
    },
    college: {
      type: String,
      default: ""
    },
    school: {
      type: String,
      default: ""
    },
    living_place: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: ""
    }

  }],
  is_online: {
    type: String,
    default: "0"
  },
  story:{
    type:String,
    default:""
  }
});

userSchema.plugin(plm);
module.exports = mongoose.model("user", userSchema);
