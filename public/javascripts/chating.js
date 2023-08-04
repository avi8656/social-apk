//fetch dashbord data for one to one chat
axios.get("/chat").then(function (response) {
    // console.log(response.data.loggedInuser._id);

    var userData = response.data.loggedInuser;

    var sender_id = userData._id;
    var receiver_id;
    var socket = io("/user-namespace", {
        auth: {
            token: userData._id
        }
    });

    var userList = document.querySelectorAll(".user");
    userList.forEach(function (user) {
        user.addEventListener('click', async function () {
            var userId = user.getAttribute('data-id');
            console.log(userId);
            receiver_id = userId;

            const response = await axios.get('/chat');
            const alluser = response.data.alluser;
            alluser.forEach(function (user) {
                if (user._id == receiver_id) {
                    let clutter = ""
                    clutter = `<div class="profile-photo">
                                    <img src="/images/uploads/${user.profileimage}" alt="">
                                </div>
                                <h1>${user.first_name} ${user.last_name}</h1>`

                    if (user.is_online == 1) {
                        clutter += `<div class="active"></div>`
                    }

                    document.querySelector(".right .nav-right").innerHTML = clutter;
                }
            })

            document.querySelector('main .right .empty').style.display = 'none'

            socket.emit("existsChat", { sender_id: sender_id, receiver_id: receiver_id })
            const chatContainer = document.querySelector("main .right #chat-container");
            chatContainer.scrollTop = chatContainer.scrollHeight;
        });

    });

    // update user online status
    socket.on("getOnlineUser", function (data) {
        // console.log(data);
        var userStatus = document.getElementById(data.user_id + '-status');
        if (userStatus) {
            userStatus.classList.add("active");
        }
    });

    // update user offline status
    socket.on("getOfflineUser", function (data) {
        // console.log(data);
        var userStatus = document.getElementById(data.user_id + '-status');
        if (userStatus) {
            userStatus.classList.remove("active");
        }
    });

    // chat save of the user for one to one chat
    const chatForm = document.querySelector("#chat-form");
    document.querySelector("#chat-form").addEventListener("submit", async function (e) {
        e.preventDefault(); // prevent the default form submission behavior

        // handle the form submission data using JavaScript
        var messageInput = document.querySelector("#message");
        let messageInputValue = messageInput.value;

        try {
            const formData = new FormData(chatForm);
            formData.append("sender_id", sender_id);
            formData.append("receiver_id", receiver_id);
            formData.append("message", messageInputValue);

            const formDataObj = Object.fromEntries(formData.entries());

            // console.log("Form Data:", formDataObj);

            const response = await axios.post("/saveChat", formDataObj);

            // console.log("Response:", response.data.data.message);
            // console.log("Response:", response.data);

            let chat = response.data.data.message;


            let html = `<div class="current-user-chat">
                            <div class="chat">
                                <p>${chat}</p>
                                <div class="tri"></div>
                            </div>
                            <div class="photo">
                                <img src="/images/uploads/${response.data.loggedInuser.profileimage}" alt="">
                            </div>
                        </div>`

            document.querySelector("#chat-container").innerHTML += html;

            response.data.data.sender_id = sender_id;
            response.data.data.receiver_id = receiver_id;
            socket.emit("newChat", response.data)

            messageInput.value = ""; // reset the form

            const chatContainer = document.querySelector("main .right #chat-container");
            chatContainer.scrollTop = chatContainer.scrollHeight;


        } catch (error) {
            console.error(error);
        }
    });

    //recieving the broadcast message for one to one chat
    socket.on("loadNewChat", function (data) {
        if (sender_id == data.data.receiver_id && receiver_id == data.data.sender_id) {
            let html = `<div class="distance-user-chat">
                            <div class="photo">
                                <img src="/images/uploads/${data.loggedInuser.profileimage}" alt="">
                            </div>
                            <div class="chat">
                                <p>${data.data.message}</p>
                                <div class="tri"></div>
                            </div>
                        </div>`
            document.querySelector("#chat-container").innerHTML += html;
        }

        const chatContainer = document.querySelector("main .right #chat-container");
        chatContainer.scrollTop = chatContainer.scrollHeight;

    });

    //load old chats for one to one chat
    socket.on("loadChats", function (data) {
        document.querySelector("#chat-container").innerHTML = "";

        console.log(data);
        var chats = data.chats

        chats.forEach(function (chat) {
            let html = ""
            let addClass = "";
            let img = "";

            if (chat.sender_id == sender_id) {
                addClass = "current-user-chat";
                img = data.sender.profileimage;
            }
            else {
                addClass = "distance-user-chat";
                img = data.reciver.profileimage;
            }

            if (addClass == 'current-user-chat') {
                html = `<div class="${addClass}" id='${chat._id}'>
                            <div class="chat">
                                <p>${chat.message}</p>
                                <div class="tri"></div>
                            </div>
                            <div class="photo">
                                <img src="/images/uploads/${img}" alt="">
                            </div>
                        </div>`;
            } else {
                html = `<div class="${addClass}" id='${chat._id}'>
                            <div class="photo">
                                <img src="/images/uploads/${img}" alt="">
                            </div>
                            <div class="chat">
                                <p>${chat.message}</p>
                                <div class="tri"></div>
                            </div>
                        </div>`;
            }

            document.querySelector("#chat-container").innerHTML += html;

        })
        const chatContainer = document.querySelector("#chat-container");
        chatContainer.scrollTop = chatContainer.scrollHeight;
        console.log(document.querySelector("#chat-container"));
    })

})

document.addEventListener('DOMContentLoaded', () => {
    const alluserMain = document.querySelector(".users");
    const alluser = alluserMain.querySelectorAll(".users .user");
    const messageSearch = document.querySelector("#message-search");

    //searches user
    const searchMessage = () => {
        const val = messageSearch.value.toLowerCase();
        alluser.forEach(chat => {
            let name = chat.querySelectorAll("h1")[0].textContent.toLowerCase(); // fix typo here
            if (name.indexOf(val) !== -1) {
                chat.style.display = "flex";
            } else {
                chat.style.display = "none";
            }
        });
    };

    //search user
    messageSearch.addEventListener("keyup", searchMessage);
})

let menuIcon = document.querySelector('nav .menu i');
let close = document.querySelector('#close');
let sidebar = document.querySelector('.sidebar');
let main = document.querySelector('main');

menuIcon.addEventListener('click', function () {
    close.style.display = "block"
    menuIcon.style.display = "none"
    sidebar.style.width = '20vw'
    main.style.opacity = '.3'
})

close.addEventListener('click', function () {
    close.style.display = "none"
    menuIcon.style.display = "block"
    sidebar.style.width = '0vw'
    main.style.opacity = '1'
})