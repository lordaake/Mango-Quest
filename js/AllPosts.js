document.addEventListener("DOMContentLoaded", async function () {
    const loadMoreButton = document.getElementById("load-more");
    const postsWrapper = document.querySelector(".posts-wrapper");
    const doubleUpIcon = document.querySelector('.double-up-container');
    const filterContent = document.querySelector('.filter-content');
    const continents = ['Africa', 'Antarctica', 'Asia', 'Europe', 'North America', 'South America', 'Oceania'];

    let page = 1;
    let totalPosts = 0;
    let fetchedPosts = 0;
    let selectedTagIds = [];

    const totalResponse = await fetch("https://mangoquest.themlmleader.com/wp-json/wp/v2/posts");
    totalPosts = parseInt(totalResponse.headers.get('X-WP-Total'));

    const response = await fetch("https://mangoquest.themlmleader.com/wp-json/wp/v2/tags");
    const tags = await response.json();

    const tagMap = new Map(tags.map(tag => [tag.name.toLowerCase(), tag.id]));

    const filterIconsDiv = document.querySelector(".filter-icons");
    continents.forEach(continent => {
        const icon = document.createElement("i");
        icon.className = "far fa-square filter-checkbox";
        icon.dataset.tagId = tagMap.get(continent.toLowerCase());

        const span = document.createElement("span");
        span.className = "icon-text";
        span.textContent = continent;

        icon.appendChild(span);
        filterIconsDiv.appendChild(icon);

        icon.addEventListener('click', async function () {
            console.log(`Clicked: ${icon.querySelector('.icon-text').textContent}`);
            const iconText = icon.querySelector('.icon-text').textContent.toLowerCase();
            if (tagMap.get(iconText)) {
                if (selectedTagIds.includes(tagMap.get(iconText))) {
                    selectedTagIds = selectedTagIds.filter(id => id !== tagMap.get(iconText));
                    icon.classList.remove('fas');
                    icon.classList.add('far');
                } else {
                    selectedTagIds.push(tagMap.get(iconText));
                    icon.classList.remove('far');
                    icon.classList.add('fas');
                }
                await loadPosts(true);
            }
        });
    });

    async function loadPosts(reset = false) {
        if (reset) {
            page = 1;
            fetchedPosts = 0;
            postsWrapper.innerHTML = '';
        }

        let url = `https://mangoquest.themlmleader.com/wp-json/wp/v2/posts?_embed&per_page=6&page=${page}`;
        if (selectedTagIds.length > 0) url += '&tags=' + selectedTagIds.join(',');

        const response = await fetch(url);
        const posts = await response.json();
        fetchedPosts += posts.length;

        if (fetchedPosts >= totalPosts || posts.length < 6) {
            loadMoreButton.style.display = 'none';
        } else {
            loadMoreButton.style.display = 'block';
        }

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

    await loadPosts();

    loadMoreButton.addEventListener("click", async function () {
        await loadPosts();
    });

    doubleUpIcon.addEventListener('click', function () {
        if (filterContent.style.display === 'none' || filterContent.style.display === '') {
            filterContent.style.display = 'flex';
            doubleUpIcon.style.transform = 'rotate(0deg)';
        } else {
            filterContent.style.display = 'none';
            doubleUpIcon.style.transform = 'rotate(180deg)';
        }
    });
});
