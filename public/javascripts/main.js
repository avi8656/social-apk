//upload post with multer code.......

//upload cover photo
document.querySelector(".profile-main .profile-main-top .profile-main-top-prt1 .edit button ").addEventListener("click", function () {
    document.querySelector("#cover-photo-input").click();
});
document.querySelector("#cover-photo-input").addEventListener("change", function () {
    document.querySelector("form[action='/uploadCover']").submit();
});

//upload profile image
document.querySelector(".profile-main .profile-main-top .profile-main-top-prt2 .left .edit").addEventListener("click", function () {
    document.querySelector("#profile-pic-input").click();
});
document.querySelector("#profile-pic-input").addEventListener("change", function () {
    document.querySelector("form[action='/uploadProfile']").submit();
});