// Loading screen
const loader = document.getElementById("loader");
const logoMask = document.querySelector(".logo-mask");
let progress = 100;

const loadingAnimation = setInterval(() => {
    progress -= 2;
    logoMask.style.clipPath = `inset(${progress}% 0 0 0)`;
    if(progress <= 0){
        clearInterval(loadingAnimation);
        setTimeout(() => {
            loader.style.opacity = "0";
            setTimeout(() => {
                loader.style.display = "none";
            },800);
        },400);
    }
},35);


// GitHub Buttons
const githubButtons = document.querySelectorAll(".github-auth-btn");

githubButtons.forEach(button => {

    button.addEventListener("click", () => {

        alert("Signed in! Users with a GitHub account will get access to the dashboard.");

        window.location.href = "dash.html";

    });

});