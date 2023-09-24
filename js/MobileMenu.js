document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    const mainHeader = document.getElementById("main-header");

    menuToggle.addEventListener("click", function () {
        mobileMenu.classList.toggle("active");

        if (mobileMenu.style.display === "none" || mobileMenu.style.display === "") {
            mobileMenu.style.display = "block";
            mainHeader.classList.add("menu-active");
            mainHeader.style.background = "linear-gradient(to bottom, #242424 0%, #242424 30%, transparent 60%, transparent 100%)";
        } else {
            mobileMenu.style.display = "none";
            mainHeader.classList.remove("menu-active");
            mainHeader.style.background = "";
        }
    });
});
