// Asynchronous function to initialize the web page
async function initialize() {
  // Select various elements from the DOM
  const carouselWrapper = document.querySelector('.carousel-wrapper');
  const carousel = document.querySelector('.carousel');
  const leftArrow = document.querySelector('.left-arrow');
  const rightArrow = document.querySelector('.right-arrow');
  const headingAndImage = document.querySelector('.heading-and-image');
  const headingIntroduction = document.querySelector('.heading-introduction');
  const previousMangoQuestText = document.querySelector('.previous-mango-quest-text');

  // Initialize variables for controlling the carousel
  let itemsToDisplay = 3;
  let currentOffset = 0;

  // Asynchronous function to fetch and populate the carousel with data
  async function fetchAndPopulateCarousel() {
    try {
      // Fetch data from a remote source
      const response = await fetch('https://mangoquest.themlmleader.com/wp-json/wp/v2/posts?_embed&per_page=100');
      const posts = await response.json();

      // Clear existing carousel items
      while (carousel.firstChild) {
        carousel.removeChild(carousel.firstChild);
      }

      // Create carousel items and populate with data
      posts.forEach(post => {
        // Create a carousel item
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item';

        // Create an image element and set its source and alt text
        const imgElement = document.createElement('img');
        const altText = post._embedded['wp:featuredmedia'][0].alt_text || post.title.rendered;
        imgElement.src = post._embedded['wp:featuredmedia'][0].source_url;
        imgElement.alt = altText;

        // Create a description element and set its inner HTML
        const descriptionElement = document.createElement('div');
        descriptionElement.className = 'description description-styled';
        descriptionElement.innerHTML = post.title.rendered;

        // Append image and description to the carousel item
        carouselItem.appendChild(imgElement);
        carouselItem.appendChild(descriptionElement);
        carousel.appendChild(carouselItem);

        // Set a data attribute with the post ID
        carouselItem.setAttribute("data-post-id", post.id);

        // Add a click event listener to navigate to the blog post when clicked
        carouselItem.addEventListener('click', function () {
          const postId = this.getAttribute("data-post-id");
          window.location.href = `blog-post.html?id=${postId}`;
        });
      });

      // Update carousel layout and behavior
      updateCarousel();
    } catch (error) {
      console.error('Error fetching and populating carousel:', error);
    }
  }

  // Function to update the position of the carousel
  function updatePosition() {
    const offset = currentOffset * (carouselWrapper.offsetWidth / itemsToDisplay);
    carousel.style.transform = `translateX(${offset}px)`;
  }

  // Function to update the state of left and right arrows
  function updateArrows() {
    const carouselItems = document.querySelectorAll('.carousel-item');
    const maxOffset = -1 * (carouselItems.length - itemsToDisplay);

    // Disable left arrow when at the beginning, and right arrow at the end
    leftArrow.disabled = currentOffset >= 0;
    rightArrow.disabled = currentOffset <= maxOffset;
  }

  // Function to update the carousel layout and behavior
  function updateCarousel() {
    const style = window.getComputedStyle(document.querySelector('.carousel-item'));
    const marginRight = parseFloat(style.marginRight);
    const marginLeft = parseFloat(style.marginLeft);
    const availableWidth = carouselWrapper.offsetWidth;

    // Adjust the number of items displayed based on available width
    if (availableWidth < 500) {
      itemsToDisplay = 1;
    } else if (availableWidth >= 500 && availableWidth < 700) {
      itemsToDisplay = 2;
    } else {
      itemsToDisplay = 3;
    }

    // Calculate the width of each carousel item
    const itemWidth = (availableWidth / itemsToDisplay) - (marginRight - 1 + marginLeft);

    // Set the width of each carousel item
    document.querySelectorAll('.carousel-item').forEach(item => {
      item.style.width = `${itemWidth}px`;
    });

    // Update the carousel position and arrow states
    updatePosition();
    updateArrows();
  }

  // Add a window resize event listener to update the carousel on resize
  window.addEventListener('resize', updateCarousel);

  // Fetch and populate the carousel data
  await fetchAndPopulateCarousel();

  // Event listener for left arrow click
  leftArrow.addEventListener('click', () => {
    // Move the carousel to the left by the specified number of items
    if (currentOffset >= 0) return;
    currentOffset += itemsToDisplay;
    currentOffset = Math.min(currentOffset, 0);
    updatePosition();
    updateArrows();
  });

  // Event listener for right arrow click
  rightArrow.addEventListener('click', () => {
    const carouselItems = document.querySelectorAll('.carousel-item');
    const maxOffset = -1 * (carouselItems.length - itemsToDisplay);

    // Move the carousel to the right by the specified number of items
    if (currentOffset <= maxOffset) return;
    currentOffset -= itemsToDisplay;
    currentOffset = Math.max(currentOffset, maxOffset);
    updatePosition();
    updateArrows();
  });

  // Function to increase font size
  function increaseFontSize() {
    const style = window.getComputedStyle(previousMangoQuestText, null).getPropertyValue('font-size');
    previousMangoQuestText.style.fontSize = (parseFloat(style) * 1.2) + 'px';
  }

  // Function to reset font size
  function resetFontSize() {
    previousMangoQuestText.style.fontSize = '';
  }

  // Event listener for mouseenter on heading and image element
  headingAndImage.addEventListener('mouseenter', () => {
    // Increase font size and apply animation for larger screens
    if (window.innerWidth > 1024) {
      headingIntroduction.style.animation = 'bounceRight 0.5s ease-out forwards';
      increaseFontSize();
    }
  });

  // Event listener for click on heading and image element
  headingAndImage.addEventListener('click', () => {
    // Handle navigation based on screen width
    if (window.innerWidth <= 1024) {
      headingIntroduction.style.animation = 'bounceDown 0.5s ease-out forwards';
      setTimeout(() => {
        window.location.href = 'blog-post.html?id=25';
      }, 1500);
    } else if (window.innerWidth > 1024) {
      window.location.href = 'blog-post.html?id=25';
    }
  });

  // Event listener for mouseleave on heading and image element
  headingAndImage.addEventListener('mouseleave', function () {
    // Reset animation and font size
    headingIntroduction.style.animation = '';
    resetFontSize();
  });
}

// Add a DOMContentLoaded event listener to initialize the code when the page is loaded
document.addEventListener('DOMContentLoaded', initialize);
