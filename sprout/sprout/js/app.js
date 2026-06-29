/* LOADER (The loading screen) animation part */
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
            }, 800);

        }, 400);
    }
}, 35);

document.getElementById("githubLogin").addEventListener("click", () => {
    alert("GitHub OAuth will be connected after backend setup.");
});