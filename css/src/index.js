const BASE_URL = 'http://localhost:3000/posts';
let currentPostId = null;

document.addEventListener('DOMContentLoaded', main);

function main() {
  displayPosts();
  addNewPostListener();
  addEditPostListener();
  document.getElementById('cancel-edit').addEventListener('click', () => {
    document.getElementById('edit-post-form').classList.add('hidden');
  });
}

function displayPosts() {
  fetch(BASE_URL)
    .then(resp => resp.json())
    .then(posts => {
      const postList = document.getElementById('post-list');
      postList.innerHTML = '';
      posts.forEach(post => {
        const div = document.createElement('div');
        div.textContent = post.title;
        div.classList.add('post-title');
        div.dataset.id = post.id;
        div.addEventListener('click', () => handlePostClick(post.id));
        postList.appendChild(div);
      });
      if (posts.length > 0) handlePostClick(posts[0].id);
    });
}

function handlePostClick(id) {
  fetch(\`\${BASE_URL}/\${id}\`)
    .then(resp => resp.json())
    .then(post => {
      currentPostId = post.id;
      const detail = document.getElementById('post-detail');
      detail.innerHTML = \`
        <h2>\${post.title}</h2>
        <p>\${post.content}</p>
        <p><strong>\${post.author}</strong></p>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      \`;
      document.getElementById('edit-btn').addEventListener('click', showEditForm);
      document.getElementById('delete-btn').addEventListener('click', deletePost);
    });
}

function addNewPostListener() {
  const form = document.getElementById('new-post-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const title = document.getElementById('new-title').value;
    const author = document.getElementById('new-author').value;
    const content = document.getElementById('new-content').value;

    const post = { title, author, content };

    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    })
    .then(resp => resp.json())
    .then(() => {
      displayPosts();
      form.reset();
    });
  });
}

function showEditForm() {
  fetch(\`\${BASE_URL}/\${currentPostId}\`)
    .then(resp => resp.json())
    .then(post => {
      document.getElementById('edit-title').value = post.title;
      document.getElementById('edit-content').value = post.content;
      document.getElementById('edit-post-form').classList.remove('hidden');
    });
}

function addEditPostListener() {
  const form = document.getElementById('edit-post-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const updated = {
      title: document.getElementById('edit-title').value,
      content: document.getElementById('edit-content').value
    };

    fetch(\`\${BASE_URL}/\${currentPostId}\`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated)
    })
    .then(resp => resp.json())
    .then(() => {
      displayPosts();
      handlePostClick(currentPostId);
      form.classList.add('hidden');
    });
  });
}

function deletePost() {
  fetch(\`\${BASE_URL}/\${currentPostId}\`, {
    method: 'DELETE'
  })
  .then(() => {
    displayPosts();
    document.getElementById('post-detail').innerHTML = '<p>Select a post to view details.</p>';
  });
};