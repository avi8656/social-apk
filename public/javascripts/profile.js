async function fetchLastPost() {
    const response = await axios.get('/profile');
    // console.log(response.data);

    const loggedInuser = response.data.loggedInuser;

    if (loggedInuser) {
        const posts = loggedInuser.posts.reverse();
        let lastPost = posts[0]
        // console.log(lastPost);
        // console.log(posts);
        const postDate = new Date(lastPost.date);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = postDate.toLocaleDateString('en-US', options);

        let clutter = `<div class="feed">`;

        clutter += `<div class="head">
                        <div class="user">
                            <div class="profile-photo">
                                <img src="/images/uploads/${loggedInuser.profileimage}">
                            </div>
                            <div class="info">
                                <h3>${loggedInuser.first_name}</h3>
                                <small>${formattedDate}</small>
                            </div>
                        </div>
                        <span class="edit">
                            <i class="ri-close-line"></i>
                        </span>
                    </div>`;

        clutter += ` <div class="photo">
                        <img src="/images/uploads/${lastPost.post}">
                    </div>`;

        clutter += `<div class="action-button">
                    <div class="interaction-buttons">`;


        if (lastPost.likes.includes(loggedInuser._id)) {
            clutter += `<a class="like-button" data-post-id="${lastPost._id}">
                            <h1 style="color: red;"><i class="ri-heart-fill"></i></h1>
                        </a>`;
        } else {
            clutter += `<a class="like-button" data-post-id="${lastPost._id}">
                            <h1><i class="ri-heart-line"></i></h1>
                        </a>`;
        }

        clutter += `<span id = "comment-icon" data-post-id="${lastPost._id}"><i class="uil uil-comment-dots"></i></span>
                <span><i class="uil uil-share-alt"></i></span>
            </div>
            <div class="bookmark">`;

        if (loggedInuser.bookmark.includes(lastPost._id)) {
            clutter += `<a class="bookmark-button" href="/bookmarkPost/${lastPost._id}"
                            data-post-id="${lastPost._id}"><span><i
                            class="ri-bookmark-fill"></i></span></a>`;
        } else {
            clutter += ` <a class="bookmark-button" href="/bookmarkPost/${lastPost._id}" 
                            data-post-id="${lastPost._id}"><span><i
                            class="ri-bookmark-line"></i></span></a>`;
        }

        clutter += `</div>
                </div>`;

        clutter += `<div class="liked-by">
                        <span><img src="./images/profile-10.jpg"></span>
                        <span><img src="./images/profile-4.jpg"></span>
                        <span><img src="./images/profile-15.jpg"></span>
                        <p class = "like-count2">Liked by <b>${lastPost.likes.length} others</p>
                    </div>`;

        clutter += `<div class="caption">
                        <p><b>${loggedInuser.first_name} </b> ${lastPost.description} <span
                            class="harsh-tag">#lifestyle</span></p>
                    </div>`;

        clutter += `<div class="text-muted comments comment-count-${lastPost._id}">
                       <a> View all ${lastPost.comment.length} comments</a>
                    </div>`;

        clutter += ` <div id="comments-main" class="comment-section-${lastPost._id}">`;

        lastPost.comment.forEach(function (comment) {
            clutter += `<div class="comment">
                            <div class="comment-left">
                                <div class="comment-proPic">
                                    <img src="/images/uploads/${comment.userpic}" alt="">
                                </div>
                            </div>
                            <div class="comment-right">
                                <div>
                                    <h5>${comment.user}</h5>
                                    <p>${comment.text}</p>
                                </div>
                            </div>
                        </div>`;
        });

        clutter += `</div>`;

        clutter += `<div class="comment-form" id="comment-form-${lastPost._id}">
                        <form id="comment-form" method="post" data-post-id="${lastPost._id}" action="/comment/${lastPost._id}">
                            <input id="comment-input" type="text" name="comment" placeholder="write comment...." autocomplete="off">
                            <input type="submit" value="Comment">
                        </form>
                    </div>`;

        clutter += `</div>`

        document.querySelector(".profile-main .profile-main-bottom .right .feeds").insertAdjacentHTML('afterbegin', clutter);

        // ==================== END OF POSTS ===============================================

        //for liking without page refresh
        forLike();

        //for commenting without page refresh
        forComment()

        //for seeing all comments
        seeComments()

        //for redirecting on comment form input
        redirectToCommentInpute();

        //for bookmark
        forBookmark();
    }
}

async function fetchLastPostForPublicPage() {
    const response = await axios.get('/public');
    // console.log(response.data);

    const loggedInuser = response.data.loggedInuser;

    if (loggedInuser) {
        const posts = loggedInuser.posts.reverse();
        let lastPost = posts[0]
        // console.log(lastPost);
        // console.log(posts);
        const postDate = new Date(lastPost.date);
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = postDate.toLocaleDateString('en-US', options);

        let clutter = `<div class="feed">`;

        clutter += `<div class="head">
                        <div class="user">
                            <div class="profile-photo">
                                <img src="/images/uploads/${loggedInuser.profileimage}">
                            </div>
                            <div class="info">
                                <h3>${loggedInuser.first_name}</h3>
                                <small>${formattedDate}</small>
                            </div>
                        </div>
                        <span class="edit">
                            <i class="ri-close-line"></i>
                        </span>
                    </div>`;

        clutter += ` <div class="photo">
                        <img src="/images/uploads/${lastPost.post}">
                    </div>`;

        clutter += `<div class="action-button">
                    <div class="interaction-buttons">`;


        if (lastPost.likes.includes(loggedInuser._id)) {
            clutter += `<a class="like-button" data-post-id="${lastPost._id}">
                        <h1 style="color: red;"><i class="ri-heart-fill"></i></h1>
                    </a>`;
        } else {
            clutter += `<a class="like-button" data-post-id="${lastPost._id}">
                        <h1><i class="ri-heart-line"></i></h1>
                    </a>`;
        }


        clutter += `<span id = "comment-icon" data-post-id="${lastPost._id}"><i class="uil uil-comment-dots"></i></span>
                <span><i class="uil uil-share-alt"></i></span>
            </div>
            <div class="bookmark">
                <span><i class="uil uil-bookmark-full "></i></span>
            </div>
        </div>`;

        clutter += `<div class="liked-by">
                        <span><img src="./images/profile-10.jpg"></span>
                        <span><img src="./images/profile-4.jpg"></span>
                        <span><img src="./images/profile-15.jpg"></span>
                        <p class = "like-count2">Liked by <b>${lastPost.likes.length} others</p>
                    </div>`;

        clutter += `<div class="caption">
                        <p><b>${loggedInuser.first_name} </b> ${lastPost.description} <span
                            class="harsh-tag">#lifestyle</span></p>
                    </div>`;

        clutter += `<div class="comment-form" id="comment-form-${lastPost._id}">
                        <form id="comment-form" method="post" data-post-id="${lastPost._id}" action="/comment/${lastPost._id}">
                            <input id="comment-input" type="text" name="comment" placeholder="write comment...." autocomplete="off">
                            <input type="submit" value="Comment">
                        </form>
                    </div>`;

        clutter += `<div class="text-muted comments comment-count-${lastPost._id}">
                       <a> View all ${lastPost.comment.length} comments</a>
                    </div>`;

        clutter += ` <div id="comments-main" class="comment-section-${lastPost._id}">`;

        lastPost.comment.forEach(function (comment) {
            clutter += `<div class="comment">
                            <div class="comment-left">
                                <div class="comment-proPic">
                                    <img src="/images/uploads/${comment.userpic}" alt="">
                                </div>
                            </div>
                            <div class="comment-right">
                                <div>
                                    <h5>${comment.user}</h5>
                                    <p>${comment.text}</p>
                                </div>
                            </div>
                        </div>`;
        });

        clutter += `</div>`;

        clutter += `</div>`

        document.querySelector(".middle .feeds").insertAdjacentHTML('afterbegin', clutter);

        // ==================== END OF POSTS ===============================================

        //for liking without page refresh
        forLike();

        //for commenting without page refresh
        forComment()

        //for seeing all comments
        seeComments()

        //for redirecting on comment form input
        redirectToCommentInpute();
    }
}

// set the value of form when it clicked..
(async function setValueOfEditDetailsForm() {
    const createPostModel = document.querySelectorAll(".profile-main .profile-main-bottom .left .intro button, .profile-main .profile-main-top .profile-main-top-prt2 .right button:nth-last-child(1)");
    const uploadform = document.querySelector('#editDetailsForm');
    const response = await axios.get('/profile');
    const loggedInuser = response.data.loggedInuser;


    createPostModel.forEach(function (createPostModel) {

        createPostModel.addEventListener('click', async (event) => {
            event.preventDefault();
            uploadform.querySelector("#bio").value = loggedInuser.newBio[0].bio;
            uploadform.querySelector("#college").value = loggedInuser.newBio[0].college;
            uploadform.querySelector("#school").value = loggedInuser.newBio[0].school;
            uploadform.querySelector("#living_place").value = loggedInuser.newBio[0].living_place;
            uploadform.querySelector("#location").value = loggedInuser.newBio[0].location;
        });
    })

})()

function forLike() {
    const likeButton = document.querySelectorAll('.like-button');
    const likeCount = document.querySelectorAll('.like-count2');
    likeButton.forEach(function (btn, index) {
        btn.addEventListener('click', async function () {
            const postId = btn.dataset.postId;
            const response = await axios.get(`/like/${postId}`);
            // Update the like button appearance based on whether the user likes the post
            const loggedInUserId = response.data.loggedInUser._id;
            const postLikes = response.data.post.likes;

            if (postLikes.includes(loggedInUserId)) {
                btn.innerHTML = `<h1 style="color: red;"><i class="ri-heart-fill"></i></h1>`;
            } else {
                btn.innerHTML = `<h1><i class="ri-heart-line"></i></h1>`;
            }
            likeCount[index].innerHTML = `Liked by <b>${response.data.likeCount} others</b> `;
        });
    });
}
forLike()

function forComment() {
    const commentForms = document.querySelectorAll('#comment-form');

    for (let i = 0; i < commentForms.length; i++) {
        commentForms[i].addEventListener('submit', async (event) => {
            event.preventDefault();

            try {
                const formData = new FormData(commentForms[i]);
                const formDataObj = Object.fromEntries(formData.entries());

                const response = await axios.post(commentForms[i].action, formDataObj);

                let cms = response.data.commentt
                const lastComment = cms[cms.length - 1];
                // console.log(lastComment);

                const newComment = `<div class="comment">
                                        <div class="comment-left">
                                            <div class="comment-proPic">
                                                <img src="/images/uploads/${lastComment.userpic}" alt="">
                                            </div>
                                        </div>
                                        <div class="comment-right">
                                            <div>
                                                <h5>${lastComment.user}</h5>
                                                <p>${lastComment.text}</p>
                                            </div>
                                        </div>
                                    </div>`;

                const postId = commentForms[i].getAttribute('data-post-id');
                const commentSection = document.querySelector(`.comment-section-${postId}`);

                // Add the new comment
                commentSection.insertAdjacentHTML('afterbegin', newComment);;
                commentSection.scrollTop = commentSection.scrollHeight;

                var commentCount = document.querySelector(`.comment-count-${postId}`);
                commentCount.innerHTML = `<a>View all ${response.data.commentCount} comments</a>`

                const commentInput = document.querySelectorAll("#comment-input");
                commentInput.forEach(function (input) {
                    input.value = '';
                });
            } catch (error) {
                console.error(error);
                // Display an error message to the user
            }
        });

    }
}
forComment()

function seeComments() {
    const comments = document.querySelectorAll('.comments');
    const feed = document.querySelectorAll('.profile-main .profile-main-bottom .right .feeds .feed,.middle .feeds .feed')
    comments.forEach(function (comment, index) {
        let isMaxHeight = false;

        comment.addEventListener("click", function () {
            if (!isMaxHeight) {
                feed[index].style.maxHeight = "max-content";
                isMaxHeight = true;
            } else {
                feed[index].style.maxHeight = "97.5vh";
                isMaxHeight = false;
            }

            // Reset the height of other feeds
            for (let i = 0; i < feed.length; i++) {
                if (i !== index) {
                    feed[i].style.maxHeight = "";
                }
            }
        });
    });
}
seeComments()

function redirectToCommentInpute() {
    const comment_icons = document.querySelectorAll('#comment-icon');
    comment_icons.forEach(function (comment_icon) {
        comment_icon.addEventListener('click', function () {
            const postId = this.getAttribute('data-post-id');
            const commentForm = document.querySelector(`#comment-form-${postId}`);
            commentForm.querySelector('input[name="comment"]').focus();
        });
    });
}
redirectToCommentInpute()

function forBookmark() {
    const bookmarkButton = document.querySelectorAll('.bookmark-button');
    bookmarkButton.forEach(function (btn, index) {
        btn.addEventListener('click', async function (event) {
            event.preventDefault();
            const postId = btn.dataset.postId;
            try {
                const response = await axios.get(`/bookmarkPost/${postId}`);
                const loggedInuser = response.data.loggedInuser;
                const bookmarkIcon = btn.querySelector('i');

                if (loggedInuser.bookmark.includes(postId)) {
                    alert(response.data.msg);
                    // Post is bookmarked
                    bookmarkIcon.classList.remove('ri-bookmark-line');
                    bookmarkIcon.classList.add('ri-bookmark-fill');
                } else {
                    alert(response.data.msg2);
                    // Post is not bookmarked
                    bookmarkIcon.classList.remove('ri-bookmark-fill');
                    bookmarkIcon.classList.add('ri-bookmark-line');
                }
            } catch (error) {
                console.error(error);
            }
        });
    });
}
forBookmark();

function forDeletePost() {
    const deleteButton = document.querySelectorAll('.delete-post-btn');
    deleteButton.forEach(function (btn) {
        btn.addEventListener('click', async function (event) {
            event.preventDefault();
            const postId = btn.dataset.postId;
            try {
                const response = await axios.get(`/delete/${postId}`);
                alert(response.data.msg)
                location.reload();
            } catch (error) {
                console.error(error);
            }
        });
    });
}
forDeletePost();

const form = document.querySelector('#uploadform');

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    try {
        await axios.post('/uploadPost', formData);
        // Clear form inputs
        form.reset();
        // Update posts without page refresh
        fetchLastPost();
        fetchLastPostForPublicPage();
        // Hide the form modal
        const modal = document.getElementById('createPostModel');
        const closeButton = modal.querySelector('.close');
        closeButton.click();
    } catch (error) {
        console.error(error);
    }
});