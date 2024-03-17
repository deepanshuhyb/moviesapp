const global = {
    curretPage: window.location.pathname
};

function highlightActiveLink() {
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link)=>{
        if(link.getAttribute('href') === global.curretPage){
            link.classList.add('active');
        }
    })
};

function init() {
    highlightActiveLink();
    switch (global.curretPage) {
        case '/':
        case '/index.html':
            console.log('home')
            break;
        case '/shows.html':
            console.log('shows');
            break;
        case '/movie-details.html':
            console.log('movie-details');
            break;
        case '/tv-details.html':
            console.log('tv-details');
            break;
        case '/search.html':
            console.log('search');
            break;
        default:
            break;
    }
}

document.addEventListener('DOMContentLoaded', init);