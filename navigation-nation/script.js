const elemById = (id) => document.getElementById(id);
const menuBars = elemById("menu-bars");
const overlay = elemById("overlay");
const nav1 = elemById("nav-1")
const nav2 = elemById("nav-2")
const nav3 = elemById("nav-3")
const nav4 = elemById("nav-4")
const nav5 = elemById("nav-5")
const navItems = [nav1, nav2, nav3, nav4, nav5]

function navAnimation(direction1, direction2){
    navItems.forEach((nav, i) => {
        nav.classList.replace(`slide-${direction1}-${i+1}`, `slide-${direction2}-${i+1}`);
    });
}

function toggleNav(){
    menuBars.classList.toggle('change');
    const presentClass = overlay.classList.toggle('overlay-active');

    if(presentClass){
        overlay.classList.replace("overlay-slide-left", "overlay-slide-right")
        // animation in
        navAnimation('out', 'in')
    }else{
        overlay.classList.replace("overlay-slide-right", "overlay-slide-left")

        // animation out
        navAnimation('in', 'out')
    }
}

//Event listeners
menuBars.addEventListener('click', toggleNav);
navItems.forEach((nav) => {
    nav.addEventListener('click', toggleNav)
});