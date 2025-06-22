document.addEventListener('DOMContentLoaded', main);

let selectedPostId = null;

function main() {
  document.getElementById('create-post').addEventListener('click', createPost);
  document.getElementById('get-posts').addEventListener('click', fetchPosts);
  document.getElementById('update-post').addEventListener('click', updatePost);
  document.getElementById('delete-post').addEventListener('click', deletePost);
  fetchPosts();
}

function fetchPosts() {
  fetch('http://localhost:3000/posts')
    .then(res => res.json())
    .then(renderPostList)
    .catch(() => alert('Failed to load posts'));
}

function renderPostList(posts) {
  const list = document.getElementById('post-list');
  list.innerHTML = '';
  posts.forEach(post => {
    const li = document.createElement('li');
    li.textContent = post.title;
    li.setAttribute('data-id', `#${post.id}`);
    li.dataset.postId = post.id;
    li.addEventListener('click', () => selectPost(post));
    list.appendChild(li);
  });
}

function selectPost(post) {
  selectedPostId = post.id;
  document.getElementById('post-title').value = post.title;
  document.getElementById('post-content').value = post.content;
}

function createPost() {
  const title = document.getElementById('post-title').value.trim();
  const content = document.getElementById('post-content').value.trim();
  if (!title || !content) return alert('Please fill both fields');

  fetch('http://localhost:3000/posts', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title, content })
  })
  .then(() => {
    alert('Post created successfully');
    fetchPosts();
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
  });
}

function updatePost() {
  if (!selectedPostId) return alert('No post selected');

  const title = document.getElementById('post-title').value.trim();
  const content = document.getElementById('post-content').value.trim();

  fetch(`http://localhost:3000/posts/${selectedPostId}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title, content })
  })
  .then(() => {
    alert('Post updated successfully');
    fetchPosts();
  });
}

function deletePost() {
  if (!selectedPostId) return alert('No post selected');

  fetch(`http://localhost:3000/posts/${selectedPostId}`, {
    method: 'DELETE'
  })
  .then(() => {
    alert('Post deleted successfully');
    fetchPosts();
    document.getElementById('post-title').value = '';
    document.getElementById('post-content').value = '';
    selectedPostId = null;
  });
}
