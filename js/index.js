async function initialize() {
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  const carousel = document.querySelector('.carousel');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  const headingAndImage = document.querySelector('.heading-and-image');
  const headingIntroduction = document.querySelector('.heading-introduction');
  const previousMangoQuestText = document.querySelector('.previous-mango-quest-text');

  let itemsToDisplay = 3;
  let currentOffset = 0;

  async function fetchAndPopulateCarousel() {
    const loader = document.querySelector('.loader');
    const loadingText = document.querySelector('.loading-text');
    loader.style.display = 'block';
    loadingText.style.display = 'block';

    try {
      const response = await fetch('https://mangoquest.tordlarsson.com/wp-json/wp/v2/posts?_embed&per_page=100');
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
    } catch (error) {
      console.error('Error fetching and populating carousel:', error);
    }

    loader.style.display = 'none';
    loadingText.style.display = 'none';
  }

  function updatePosition() {
    const offset = currentOffset * (carouselWrapper.offsetWidth / itemsToDisplay);
    carousel.style.transform = `translateX(${offset}px)`;
  }

  function updateArrows() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    const maxOffset = -1 * (carouselItems.length - itemsToDisplay);

    leftArrow.disabled = currentOffset >= 0;
    rightArrow.disabled = currentOffset <= maxOffset;
  }

  function updateCarousel() {
    const style = window.getComputedStyle(document.querySelector('.carousel-item'));
    const marginRight = parseFloat(style.marginRight);
    const marginLeft = parseFloat(style.marginLeft);
    const availableWidth = carouselWrapper.offsetWidth;

    if (availableWidth < 400) {
      itemsToDisplay = 1;
    } else if (availableWidth >= 400 && availableWidth < 700) {
      itemsToDisplay = 2;
    } else {
      itemsToDisplay = 3;
    }

    const itemWidth = (availableWidth / itemsToDisplay) - (marginRight - 1 + marginLeft);

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
    currentOffset += itemsToDisplay;
    currentOffset = Math.min(currentOffset, 0);
    updatePosition();
    updateArrows();
  });

  rightArrow.addEventListener('click', () => {
    const carouselItems = document.querySelectorAll('.carousel-item');
    const maxOffset = -1 * (carouselItems.length - itemsToDisplay);

    if (currentOffset <= maxOffset) return;
    currentOffset -= itemsToDisplay;
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
      }, 1000);
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
