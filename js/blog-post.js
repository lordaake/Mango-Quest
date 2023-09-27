document.addEventListener("DOMContentLoaded", init);

async function init() {
  const loader = document.querySelector('.loader');
  const loadingText = document.querySelector('.loading-text');

  try {
    loader.style.display = 'block';
    loadingText.style.display = 'block';

    const postId = getPostId();
    const post = await fetchPostData(postId);

    populateBlogSection(post);
    setupImageModal();
  } catch (error) {
    console.error('Error during initialization: ', error);
  } finally {
    loader.style.display = 'none';
    loadingText.style.display = 'none';
  }
}

function getPostId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

async function fetchPostData(postId) {
  const response = await fetch(`https://mangoquest.themlmleader.com/wp-json/wp/v2/posts/${postId}?_embed`);
  return response.json();
}

function populateBlogSection(post) {
  const blogSection = document.querySelector('.blog-post');
  const { title, content } = post;
  const { source_url, alt_text } = post._embedded['wp:featuredmedia'][0];

  blogSection.innerHTML = `
    <h1 class="h1-blogpost">${title.rendered}</h1>
    <img src="${source_url}" alt="${alt_text}" class="clickable-image">
    <div class="post-content">${content.rendered}</div>
  `;

  document.title = title.rendered;
  setupImageModal();
}

function setupImageModal() {
  const modal = document.getElementById('imageModal');
  const modalImage = document.getElementById('modalImage');

  if (modal === null) {
    console.error("Modal element is not in the DOM.");
    return;
  }

  const images = document.querySelectorAll('.clickable-image, .post-content img');

  images.forEach(image => {
    image.addEventListener('click', function () {
      modal.style.display = 'flex';
      modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      modalImage.src = this.src;
      modalImage.alt = this.alt;
    });
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      closeModal();
    }

  });


  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeModal();
    }
  });
}

function closeModal() {
  const modal = document.getElementById('imageModal');
  modal.style.display = 'none';
}
