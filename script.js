// Load posts from localStorage on page load
document.addEventListener("DOMContentLoaded", loadPosts);

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const container = document.getElementById("postContainer");
    container.innerHTML = "";
    posts.forEach(postData => {
        const post = createPostElement(postData);
        container.appendChild(post);
    });
}

function savePosts() {
    const posts = [];
    const postElements = document.querySelectorAll(".post");
    postElements.forEach(postEl => {
        const id = postEl.dataset.id;
        const text = postEl.querySelector("p").innerText;
        const timestamp = postEl.querySelector(".timestamp").innerText;
        const likes = parseInt(postEl.querySelector(".like-btn").dataset.likes) || 0;
        const liked = postEl.querySelector(".like-btn").innerText.includes("❤️");
        const comments = Array.from(postEl.querySelectorAll(".comment")).map(c => c.innerText);
        posts.push({ id, text, timestamp, likes, liked, comments });
    });
    localStorage.setItem("posts", JSON.stringify(posts));
}

function createPostElement(postData) {
    const post = document.createElement("div");
    post.className = "post";
    post.dataset.id = postData.id || Date.now().toString();
    post.innerHTML = `
        <p>${postData.text}</p>
        <div class="timestamp">${postData.timestamp || new Date().toLocaleString()}</div>
        <div class="post-actions">
            <button class="like-btn" data-likes="${postData.likes || 0}" onclick="likePost(this)">${postData.liked ? "I LOVE YOU  Liked" : "👍 Like"} (${postData.likes || 0})</button>
            <button class="comment-btn" onclick="toggleComments(this)">💬 Comment</button>
            <button class="edit-btn" onclick="editPost(this)">✏️ Edit</button>
            <button class="delete-btn" onclick="deletePost(this)">🗑️ Delete</button>
        </div>
        <div class="comments-section" style="display: none;">
            <div class="comment-input">
                <input type="text" placeholder="Write a comment..." />
                <button onclick="addComment(this)">Post</button>
            </div>
            <div class="comments-list">
                ${(postData.comments || []).map(c => `<div class="comment">${c}</div>`).join("")}
            </div>
        </div>
    `;
    return post;
}

function addPost() {
    const text = document.getElementById("postText").value;
    if (text.trim() === "") return;

    const postData = {
        id: Date.now().toString(),
        text: text,
        timestamp: new Date().toLocaleString(),
        likes: 0,
        liked: false,
        comments: []
    };

    const container = document.getElementById("postContainer");
    const post = createPostElement(postData);
    container.prepend(post);
    document.getElementById("postText").value = "";
    savePosts();
}

function likePost(btn) {
    const postEl = btn.closest(".post");
    let likes = parseInt(btn.dataset.likes) || 0;
    const liked = btn.innerText.includes("❤️");
    if (liked) {
        likes--;
        btn.innerText = `👍 Like (${likes})`;
    } else {
        likes++;
        btn.innerText = `❤️ Liked (${likes})`;
    }
    btn.dataset.likes = likes;
    savePosts();
}

function toggleComments(btn) {
    const commentsSection = btn.closest(".post").querySelector(".comments-section");
    commentsSection.style.display = commentsSection.style.display === "none" ? "block" : "none";
}

function addComment(btn) {
    const postEl = btn.closest(".post");
    const input = postEl.querySelector(".comment-input input");
    const commentText = input.value.trim();
    if (commentText === "") return;

    const commentsList = postEl.querySelector(".comments-list");
    const comment = document.createElement("div");
    comment.className = "comment";
    comment.innerText = commentText;
    commentsList.appendChild(comment);
    input.value = "";
    savePosts();
}

let currentEditPost = null;

function editPost(btn) {
    currentEditPost = btn.closest(".post");
    const text = currentEditPost.querySelector("p").innerText;
    document.getElementById("editText").value = text;
    document.getElementById("editModal").style.display = "block";
}

function closeEditModal() {
    document.getElementById("editModal").style.display = "none";
    currentEditPost = null;
}

function saveEdit() {
    if (!currentEditPost) return;
    const newText = document.getElementById("editText").value.trim();
    if (newText === "") return;
    currentEditPost.querySelector("p").innerText = newText;
    closeEditModal();
    savePosts();
}

function deletePost(btn) {
    if (confirm("Are you sure you want to delete this post?")) {
        btn.closest(".post").remove();
        savePosts();
    }
}

document.getElementById("menuBtn").addEventListener("click", () => {
    alert("Menu clicked — add dropdown or actions here.");
});
