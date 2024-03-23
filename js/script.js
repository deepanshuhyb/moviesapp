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

async function displayPopularShows() {
    const { results } = await fetchApi('tv/popular');
    console.log(results);
    results.forEach((show)=>{
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = 
        `<a href="tv-details.html?id=${show.id}">
        ${show.poster_path ? `<img
        src="https://image.tmdb.org/t/p/w500${show.poster_path}"
        class="card-img-top"
        alt="${show.name}"
        />` : `<img
        src="images/no-image.jpg"
        class="card-img-top"
        alt="${show.name}"
        />`}
        </a>
        <div class="card-body">
          <h5 class="card-title">${show.name}</h5>
          <p class="card-text">
            <small class="text-muted">Aired: ${show.first_air_date}</small>
          </p>
        </div>
        `
        document.querySelector('#popular-shows').appendChild(div);
    })
}

async function displayMovie() {
    const id = window.location.search.split('=')[1];
    // console.log(id);
    const results = await fetchApi(`movie/${id}`);
    // console.log(`movie/${id}`);
    const div = document.createElement('div');

    div.innerHTML = `
    <div class="details-top">
    <div>
    ${results.poster_path ? `<img
    src="https://image.tmdb.org/t/p/w500${results.poster_path}"
    class="card-img-top"
    alt="${results.name}"
    />` : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${results.name}"
    />`}
    </div>
    <div>
      <h2>${results.title}</h2>
      <p>
        <i class="fas fa-star text-primary"></i>
       ${results.vote_average.toFixed(1)} / 10
      </p>
      <p class="text-muted">Release Date: ${results.release_date}</p>
      <p>
      ${results.overview}
      </p>
      <h5>Genres</h5>
      <ul class="list-group">
        ${results.genres.map((genre)=>
          `<li>${genre.name}</li>`
        ).join('')}
      </ul>
      <a href="${results.homepage}" target="_blank" class="btn">Visit Movie Homepage</a>
    </div>
  </div>
  <div class="details-bottom">
    <h2>Movie Info</h2>
    <ul>
      <li><span class="text-secondary">Budget:</span> $${results.budget}</li>
      <li><span class="text-secondary">Revenue:</span> $${results.revenue}</li>
      <li><span class="text-secondary">Runtime:</span> ${results.runtime} minutes</li>
      <li><span class="text-secondary">Status:</span> ${results.release_date}</li>
    </ul>
    <h4>Production Companies</h4>
    <div class="list-group">${results.production_companies.map((company)=> `<span>${company.name}</span>`).join(', ')}</div>
  </div>
    `
    document.querySelector('#movie-details').appendChild(div);
}

function showspinner(){
    document.querySelector('.spinner').classList.add('show');
}

function hidespinner(){
    document.querySelector('.spinner').classList.remove('show');
}


async function fetchApi(endpoint) {
    const API_KEY = '6c1a2240bbeb7f139779642257b534e2';

    const API_URL = 'http://api.themoviedb.org/3/';

    showspinner();

    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    
    const data = await response.json();

    hidespinner();

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
            displayPopularShows();
            break;
        case '/movie-details.html':
            console.log('movie-details');
            displayMovie();
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