let itemsFit = 0;
let itemsToMove = 0;
let currentOffset = 0;

async function initialize() {
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  const carousel = document.querySelector('.carousel');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  const headingAndImage = document.querySelector('.heading-and-image');
  const headingIntroduction = document.querySelector('.heading-introduction');
  const previousMangoQuestText = document.querySelector('.previous-mango-quest-text');

  async function fetchAndPopulateCarousel() {
    const response = await fetch('https://mangoquest.themlmleader.com/wp-json/wp/v2/posts?_embed&per_page=100');
    const posts = await response.json();

    while (carousel.firstChild) {
      carousel.removeChild(carousel.firstChild);
    }

    posts.forEach(post => {
      const carouselItem = document.createElement('div');
      carouselItem.className = 'carousel-item';

      const imgElement = document.createElement('img');
      const altText = post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered;
      imgElement.src = post._embedded['wp:featuredmedia'][0].source_url;
      imgElement.alt = altText;

      const descriptionElement = document.createElement('div');
      descriptionElement.className = 'description description-styled';
      descriptionElement.innerHTML = post.title.rendered;

      carouselItem.appendChild(imgElement);
      carouselItem.appendChild(descriptionElement);
      carousel.appendChild(carouselItem);

      carouselItem.setAttribute("data-post-id", post.id);

      carouselItem.addEventListener('click', function () {
        const postId = this.getAttribute("data-post-id");
        window.location.href = `blog-post.html?id=${postId}`;
      });
    });

    updateCarousel();
  }


  function updatePosition() {
    const offset = currentOffset * (carouselWrapper.offsetWidth / itemsFit);
    carousel.style.transform = `translateX(${offset}px)`;
  }

  function updateArrows() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    const maxOffset = -1 * (carouselItems.length - itemsFit);

    leftArrow.disabled = currentOffset >= 0;
    rightArrow.disabled = currentOffset <= maxOffset;
  }

  function updateCarousel() {
    const style = window.getComputedStyle(document.querySelector('.carousel-item'));
    const marginRight = parseFloat(style.marginRight);
    const marginLeft = parseFloat(style.marginLeft);
    const availableWidth = carouselWrapper.offsetWidth;

    itemsFit = Math.floor(availableWidth / (200 + marginRight + marginLeft));
    itemsToMove = (itemsFit === 1) ? 1 : 3;
    const itemWidth = (availableWidth / itemsFit) - (marginRight + marginLeft);

    document.querySelectorAll('.carousel-item').forEach(item => {
      item.style.width = `${itemWidth}px`;
    });

    updatePosition();
    updateArrows();
  }

  window.addEventListener('resize', updateCarousel);
  await fetchAndPopulateCarousel();

  leftArrow.addEventListener('click', () => {
    if (currentOffset >= 0) return;

    currentOffset += itemsToMove;
    currentOffset = Math.min(currentOffset, 0);
    updatePosition();
    updateArrows();
  });

  rightArrow.addEventListener('click', () => {
    const carouselItems = document.querySelectorAll('.carousel-item');
    const maxOffset = -1 * (carouselItems.length - itemsFit);
    if (currentOffset <= maxOffset) return;

    currentOffset -= itemsToMove;
    currentOffset = Math.max(currentOffset, maxOffset);
    updatePosition();
    updateArrows();
  });

  function increaseFontSize() {
    const style = window.getComputedStyle(previousMangoQuestText, null).getPropertyValue('font-size');
    previousMangoQuestText.style.fontSize = (parseFloat(style) * 1.2) + 'px';
  }

  function resetFontSize() {
    previousMangoQuestText.style.fontSize = '';
  }

  headingAndImage.addEventListener('mouseenter', () => {
    if (window.innerWidth > 1024) {
      headingIntroduction.style.animation = 'bounceRight 0.5s ease-out forwards';
      increaseFontSize();
    }
  });

  headingAndImage.addEventListener('click', () => {
    if (window.innerWidth <= 1024) {
      headingIntroduction.style.animation = 'bounceDown 0.5s ease-out forwards';
      setTimeout(() => {
        window.location.href = 'blog-post.html?id=25';
      }, 1500);
    } else if (window.innerWidth > 1024) {
      window.location.href = 'blog-post.html?id=25';
    }
  });


  headingAndImage.addEventListener('mouseleave', function () {
    headingIntroduction.style.animation = '';
    resetFontSize();
  });
}


document.addEventListener('DOMContentLoaded', initialize);