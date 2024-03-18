const global = {
    curretPage: window.location.pathname
};

async function displayPopularMovies() {
    const { results }= await fetchApi('movie/popular');
    console.log(results);

    results.forEach((movie)=>{
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
        ${movie.poster_path ? `<img
        src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
        class="card-img-top"
        alt="${movie.title}"
        />`: `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${movie.title}"
        />`
        }
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>`

        document.querySelector('#popular-movies').appendChild(div);
    })
}

async function fetchApi(endpoint) {
    const API_KEY = '6c1a2240bbeb7f139779642257b534e2';

    const API_URL = 'http://api.themoviedb.org/3/';

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    
    const data = await response.json();

    return data;
}

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
            console.log('home');
            displayPopularMovies();
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