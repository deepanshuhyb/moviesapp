const global = {
    curretPage: window.location.pathname,
    search: {
      type: '',
      term: '',
      page: 1,
      totalPages: 1,
      totalResults: 0
    },
    api: {
      apiKey: '6c1a2240bbeb7f139779642257b534e2',
      apiURL: 'https://api.themoviedb.org/3/'
    }
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


async function searchAPI() {
  const API_KEY = global.api.apiKey;

  const API_URL = global.api.apiURL;

  showspinner();

  const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`);
  
  const data = await response.json();

  hidespinner();

  return data;
}


async function search() {
  const url = window.location.search;
  const urlparam = new URLSearchParams(url);
  global.search.type = urlparam.get('type');
  global.search.term = urlparam.get('search-term');
  
  if (global.search.term !== '' && global.search.term !== null) {
    const {results, total_pages, page, total_results} = await searchAPI();

    global.search.page = page;
    global.search.totalPages = total_pages;
    global.search.totalResults = total_results;

    if(results.length === 0){
      customAlert('no results found', 'alert-error');
      return;
    }
    console.log(results)
    displaSearchResults(results);
    document.querySelector('#search-term').value = '';
  } else{
    customAlert('please enter a search term', 'alert-error');
  }
}



function pagination() {

  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
  `

  document.querySelector('#pagination').appendChild(div);

  if(global.search.page === 1){
    document.querySelector('#prev').disabled = true;
  }
  
  if(global.search.page === global.search.totalPages){
    document.querySelector('#next').disabled = true;
  }


  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const {results, total_pages} = await searchAPI();
    displaSearchResults(results);
  });
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const {results, total_pages} = await searchAPI();
    displaSearchResults(results);
  });
}

function displaSearchResults(results) {

  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';


  results.forEach((result)=>{
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = 
    `<a href="tv-details.html?id=${result.id}">
    ${result.poster_path ? `<img
    src="https://image.tmdb.org/t/p/w500${result.poster_path}"
    class="card-img-top"
    alt="${global.search.type === 'movie' ? result.title : result.name}"
    />` : `<img
    src="images/no-image.jpg"
    class="card-img-top"
    alt="${global.search.type === 'movie' ? result.title : result.name}"
    />`}
    </a>
    <div class="card-body">
      <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
      <p class="card-text">
        <small class="text-muted">Aired: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
      </p>
    </div>
    `
    document.querySelector('#search-results-heading').innerHTML = `
    <h2>${results.length} out of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `;
    document.querySelector('#search-results').appendChild(div);
  })
  pagination();
}

async function displaySlider() {
  const { results } = await fetchApi('movie/now_playing');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
    <a href="movie-details.html?id=${movie.id}">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
    </a>
    <h4 class="swiper-rating">
      <i class="fas fa-star text-secondary"></i> ${movie.vote_average.toFixed(1)} / 10
    </h4>
    `
    document.querySelector('.swiper-wrapper').appendChild(div);
    initSwiper();
  })
  
  // console.log()
}



function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMdoe: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints:{
      500:{
        slidesPerView: 2
      },
      700:{
        slidesPerView: 3
      },
      1200:{
        slidesPerView: 4
      }
    }
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


async function displayShow(){
  const id = window.location.search.split('=')[1];
  // console.log(id);
  const results = await fetchApi(`tv/${id}`);
  console.log(`show/${id}`);
  const div = document.createElement('div');
  
  displaybackground('show', results.backdrop_path);

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
    <h2>${results.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
     ${results.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Last Air Date: ${results.last_air_date}</p>
    <p>
    ${results.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${results.genres.map((genre)=>
        `<li>${genre.name}</li>`
      ).join('')}
    </ul>
    <a href="${results.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Episodes:</span> ${results.number_of_episodes}</li>
    <li><span class="text-secondary">Seasons:</span> ${results.number_of_seasons}</li>
    <li><span class="text-secondary">Last Episode To Aired On:</span> ${results.last_episode_to_air.air_date}</li>
    <li><span class="text-secondary">Status:</span> ${results.first_air_date}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">${results.production_companies.map((company)=> `<span>${company.name}</span>`).join(', ')}</div>
</div>
  `
  document.querySelector('#show-details').appendChild(div);
}

async function displayMovie() {
    const id = window.location.search.split('=')[1];
    // console.log(id);
    const results = await fetchApi(`movie/${id}`);
    // console.log(`movie/${id}`);
    const div = document.createElement('div');
    
    displaybackground('movie', results.backdrop_path);

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
    const API_KEY = global.api.apiKey;

    const API_URL = global.api.apiURL;

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

function customAlert(message, className) {
  const div = document.createElement('div');
  div.classList.add('alert', className);
  div.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(div);

  setTimeout(()=>{div.remove()}, 3000);
}

function displaybackground(type , backgroundPath){
  const divBg = document.createElement('div');
  divBg.style.background = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  divBg.style.backgroundPosition = 'center';
  divBg.style.backgroundSize = 'cover';
  divBg.style.backgroundRepeat = 'no-repeat';
  divBg.style.height = '100vh';
  divBg.style.width = '100vw';
  divBg.style.position = 'absolute';
  divBg.style.top = '0';
  divBg.style.left = '0';
  divBg.style.zIndex = '-1';
  divBg.style.opacity = '0.1';

  if(type === 'movie'){
    document.querySelector('#movie-details').appendChild(divBg);
  } else{
    document.querySelector('#show-details').appendChild(divBg);
  }
}

function init() {
    highlightActiveLink();
    switch (global.curretPage) {
        case '/':
        case '/index.html':
            console.log('home');
            displayPopularMovies();
            displaySlider();
            break;
        case '/shows.html':
        case '/shows':
            console.log('shows');
            displayPopularShows();
            break;
        case '/movie-details.html':
            console.log('movie-details');
            displayMovie();
            break;
        case '/tv-details.html':
            console.log('tv-details');
            displayShow();
            break;
        case '/search.html':
            console.log('search');
            search();
            break;
        default:
            break;
    }
}

document.addEventListener('DOMContentLoaded', init);