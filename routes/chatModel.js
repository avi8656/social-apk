var mongoose = require("mongoose");
mongoose.connect("mongodb+srv://aviSocial8656:Avi@1741@social.aenbmvz.mongodb.net/?retryWrites=true&w=majority");

var chatSchema = mongoose.Schema({

    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    receiver_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    message: {
        type: String,
        default:""
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("chat", chatSchema);
