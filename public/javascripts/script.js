// search for all user for backend 
document.addEventListener('DOMContentLoaded', () => {
    const alluserMain = document.querySelector("body>.alluser");
    const alluser = alluserMain.querySelectorAll("body>.alluser .user");
    const messageSearch = document.querySelector("#message-search-alluser");

    messageSearch.addEventListener('click', function () {
        alluserMain.style.display = "block"
    })

    document.addEventListener('click', function (event) {
        const target = event.target;
        if (!alluserMain.contains(target) && target !== messageSearch) {
            alluserMain.style.display = "none";
        }
    });
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

// end of search for all user for backend ............................






//SIDEBAR
const menuItems = document.querySelectorAll('.menu-item');

//MESSAGES
const messagesNotification = document.querySelector("#messages-notifications");
const messages = document.querySelector(".messeges");
const message = messages.querySelectorAll(".message");
const messageSearch = document.querySelector("#message-search");

//THEME
const theme = document.querySelector("#theme");
const themeModel = document.querySelector(".customize-theme");
var root = document.querySelector(":root");
var colorPalatte = document.querySelectorAll(".choose-color span");


// ================SIDEBAR=================

//remove active class for all menu items
const changeActiveIteme = () => {
    menuItems.forEach(item => {
        item.classList.remove('active');
    })
}

menuItems.forEach(item => {
    item.addEventListener("click", () => {
        changeActiveIteme();
        item.classList.add('active');
    })
})

// ================MESSEGES=================
//searches chats
const searchMessage = () => {
    const val = messageSearch.value.toLowerCase();
    message.forEach(chat => {
        let name = chat.querySelectorAll("h5")[0].textContent.toLowerCase(); // fix typo here
        if (name.indexOf(val) !== -1) {
            chat.style.display = "flex";
        } else {
            chat.style.display = "none";
        }
    });
};

//search chat
messageSearch.addEventListener("keyup", searchMessage);


//higlight messages card when messages menu items is clicked
messagesNotification.addEventListener("click", () => {
    messages.style.boxShadow = "0 0 1rem var(--color-primary)"
    messagesNotification.querySelector(".notification-count").style.display = "none"
    setTimeout(() => {
        messages.style.boxShadow = "none"
    }, 2000);
})


//THEME/DISPLAY CUSTIMIZATON

//opens model
const openThemeModel = () => {
    themeModel.style.display = "grid"
}

//close model
const closeThemeModel = (e) => {
    if (e.target.classList.contains("customize-theme")) {
        themeModel.style.display = "none"
    }
}
//close model
themeModel.addEventListener("click", closeThemeModel)

theme.addEventListener("click", openThemeModel);



//remove active class from colors
const changeActiveColorClass = () => {
    colorPalatte.forEach(colorPicker => {
        colorPicker.classList.remove("active")
    })
}


//chaneg primary colors
colorPalatte.forEach(color => {
    color.addEventListener("click", () => {
        let primaryHue;
        //remove active class from colors
        changeActiveColorClass();

        if (color.classList.contains('color-1')) {
            primaryHue = 252;
        } else if (color.classList.contains('color-2')) {
            primaryHue = 52;
        } else if (color.classList.contains('color-3')) {
            primaryHue = 352;
        } else if (color.classList.contains('color-4')) {
            primaryHue = 152;
        } else if (color.classList.contains('color-5')) {
            primaryHue = 202;
        }
        color.classList.add("active");

        root.style.setProperty("--primary-color-hue", primaryHue);
    })
})

//END