document.addEventListener("DOMContentLoaded", async function () {
    const loadMoreButton = document.getElementById("load-more");
    const postsWrapper = document.querySelector(".posts-wrapper");
    let page = 1;
    let totalPosts = 0;
    let fetchedPosts = 0;

    const totalResponse = await fetch("https://mangoquest.themlmleader.com/wp-json/wp/v2/posts");
    const totalData = await totalResponse.headers.get('X-WP-Total');
    totalPosts = parseInt(totalData);

    async function loadPosts() {
        const response = await fetch(`https://mangoquest.themlmleader.com/wp-json/wp/v2/posts?_embed&per_page=6&page=${page}`);
        const posts = await response.json();

        fetchedPosts += posts.length;

        if (fetchedPosts >= totalPosts) {
            loadMoreButton.style.display = 'none';
        }

        if (posts.length > 0) {
            posts.forEach(post => {
                const singlePost = document.createElement("div");
                singlePost.className = "single-post";

                const imgElement = document.createElement("img");
                const featuredImage = post._embedded["wp:featuredmedia"][0].source_url;
                imgElement.src = featuredImage;
                imgElement.className = "post-image";

                imgElement.addEventListener("click", function () {
                    window.location.href = `blog-post.html?id=${post.id}`;
                });

                const dateElement = document.createElement("div");
                dateElement.className = "post-date";
                dateElement.innerHTML = new Date(post.date).toLocaleDateString();

                const titleElement = document.createElement("div");
                titleElement.className = "post-title";
                titleElement.innerHTML = post.title.rendered;

                singlePost.appendChild(imgElement);
                singlePost.appendChild(dateElement);
                singlePost.appendChild(titleElement);
                postsWrapper.appendChild(singlePost);
            });

            page++;
        }
    }

    loadPosts();

    loadMoreButton.addEventListener("click", function () {
        loadPosts();
    });
});



document.addEventListener("DOMContentLoaded", function () {
    const doubleUpIcon = document.querySelector('.double-up');
    const filterBox = document.querySelector('.filter-box');
    const filterContent = document.querySelector('.filter-content');

    doubleUpIcon.addEventListener('click', function () {
        if (getComputedStyle(filterBox).height >= '0px') {
            filterBox.style.height = 'fit-content';
        } else {
            filterBox.style.height = '100%';
        }

        if (getComputedStyle(filterContent).display === 'flex') {
            filterContent.style.display = 'none';
        } else {
            filterContent.style.display = 'flex';
        }

        if (filterContent.style.display === 'none') {
            doubleUpIcon.style.transform = 'rotate(180deg)';
        } else {
            doubleUpIcon.style.transform = 'rotate(0deg)';
        }
    });
});

