const toggleSwitch = document.querySelector('input[type="checkbox"]');

const elemById = (id) => document.getElementById(id)
const nav = elemById('nav');
const toggleIcon = elemById('toggle-icon');
const image1 = elemById('image1');
const image2 = elemById('image2');
const image3 = elemById('image3');
const textBox = elemById('text-box');

function changeImageMode(color){
    image1.src = `img/coder_${color}.svg`;
    image2.src = `img/proud_${color}.svg`;
    image3.src = `img/idea_${color}.svg`;
}

function toggleDarkLightMode(isDark){
    nav.style.backgroundColor = isDark ? 'rgb(0 0 0  / 20%)' : 'rgb(255 255 255  / 50%)';
    textBox.style.backgroundColor = isDark ? 'rgb(255 255 255 / 50%)' : 'rgb(0 0 0 / 20%)';
    toggleIcon.children[0].textContent = isDark ? 'Dark Mode' : 'Light Mode';
    isDark ? toggleIcon.children[1].classList.replace('fa-sun', 'fa-moon') :  toggleIcon.children[1].classList.replace('fa-moon', 'fa-sun');
    isDark ? changeImageMode('dark') : changeImageMode('light');
}

function swithcTheme(event){
    if (event.target.checked){
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        toggleDarkLightMode(true)
    }else{
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        toggleDarkLightMode(false)
    }
}

// check theme from local storage
const currentTheme = localStorage.getItem('theme');
if (currentTheme){
    document.documentElement.setAttribute('data-theme', currentTheme);

    if (currentTheme === 'dark'){
        toggleSwitch.checked = true;
        toggleDarkLightMode('dark');
    }
}

// event listener
toggleSwitch.addEventListener('change', swithcTheme);