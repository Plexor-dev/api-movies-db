const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json'
    },
    params: {
        'api_key': API_KEY,
        "language": navigator.language || "es-ES",
    }
})


//Utils

const lazyLoader = new IntersectionObserver(entries => {
  entries.forEach((entry) => {
    if(entry.isIntersecting){
      const url = entry.target.getAttribute('data-img');
      entry.target.setAttribute('src', url);
    }
  })
})

function createMovie(movies,
  container, 
  {lazyLoad = false,
  clean = true } = {}) {

  if(clean){
    container.innerHTML = '';
  }

  movies.forEach(m => {//console.log(m.title)
  const movieContainer = document.createElement('div');
  movieContainer.classList.add('movie-container');


  const movieImg = document.createElement('img');
  movieImg.classList.add('movie-img');
  movieImg.setAttribute('loading', 'lazy');
  movieImg.addEventListener('error', () => {
    movieImg.style.background = 'red';
  })
  movieImg.addEventListener('click', () => {
    location.hash = `#movie=${m.id}`;
  })
  
  movieImg.setAttribute( lazyLoad ? 'data-img' : 'src', `https://image.tmdb.org/t/p/w300${m.poster_path}`);
  movieImg.setAttribute('alt', m.title);

  const movieBtn = document.createElement('button');
  movieBtn.classList.add('movie-btn');

  likedGetMovies()[m.id] && movieBtn.classList.add('movie-btn--liked');

  movieBtn.addEventListener('click', () => {
    movieBtn.classList.toggle('movie-btn--liked')
    likeSetMovie(m);
    getLikedMovie();
  })

  if(lazyLoad){
    lazyLoader.observe(movieImg);
  }

  movieContainer.appendChild(movieImg);
  movieContainer.appendChild(movieBtn);
  container.appendChild(movieContainer);
  });
}

function createCategory(categories,container){
  container.innerHTML = '';

  categories.forEach(category => {//console.log(m.title)


  const categoryContainer = document.createElement('div');
  categoryContainer.classList.add('category-container');

  const categoryTitle = document.createElement('h3');
  const categoryTitleText = document.createTextNode(category.name);

  categoryTitle.classList.add('category-title');
  categoryTitle.setAttribute('id', `id${category.id}`);
  categoryTitle.addEventListener('click', () => {
    location.hash = `#category=${category.id}-${category.name}`;
  })

  categoryContainer.appendChild(categoryTitle);
  categoryTitle.appendChild(categoryTitleText);


  container.appendChild(categoryContainer);
  });
}



function likedGetMovies(){
const item = JSON.parse(localStorage.getItem('liked_item'));
let movie;

if(item){
  movie = item;
} else {
  movie = {};
}
return movie;
}

function likeSetMovie(movie){
const likedMovie = likedGetMovies();

if(likedMovie[movie.id]){
  likedMovie[movie.id] = undefined;
} else {
  likedMovie[movie.id] = movie;
}

return localStorage.setItem('liked_item', JSON.stringify(likedMovie));
}

function getLikedMovie(){
  const likedMovie = likedGetMovies();

  const movieArray = Object.values(likedMovie)

  createMovie(movieArray, likedMovieContainer, {lazyLoad: true, clean: true});

}



//!Llamados a la API


async function getTrendingMoviesPreview(){
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    createMovie(movies, trendingMoviesPreviewList, true);

   
}

async function getCategoriesMoviesPreview(){
    const {data} = await api('genre/movie/list');

    const categories = data.genres;
    createCategory(categories, categoriesPreviewList)

}

async function getMoviesbyCategory(id){
    const {data} = await api('discover/movie', {
    params: {
    with_genres: id,
   }
 }
);
    const movies = data.results;
    maxPage = data.total_pages;

    createMovie(movies, genericSection, {lazyLoad: true});
}

function getPaginatedMoviesbyCategory(id){
  return async function () {

    const { 
      scrollTop, 
      scrollHeight, 
      clientHeight } = document.documentElement;
  
      const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 25)
  
      const pageIsNotMax = page < maxPage;
  
      if (scrollIsBottom && pageIsNotMax) {
        page++;
        const {data} = await api('discover/movie', {
          params: {
          with_genres: id,
          page,
         }
       }
      );
          const movies = data.results;
          maxPage = data.total_pages;

        createMovie(movies, 
          genericSection, 
          {lazyLoad: true, clean: false});
      }
      }}

async function getMoviesBySearch(query){
    const {data} = await api('search/movie', {
    params: {
    query,
   }
 }
);
    const movies = data.results;
    maxPage = data.total_pages;
    console.log(maxPage)

    createMovie(movies, genericSection);
}



function getPaginatedMoviesBySearch(query) {
  return async function () {

  const { 
    scrollTop, 
    scrollHeight, 
    clientHeight } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 25)

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const {data} = await api('search/movie', {
        params: {
        query,
        page,
       }
     }
    );
        const movies = data.results;

        maxPage = data.total_pages;
        console.log(maxPage)
      createMovie(movies, 
        genericSection, 
        {lazyLoad: true, clean: false});
    }
    }}

async function getTrendingMovies(){
  const {data} = await api('trending/movie/day');
  const movies = data.results;

  maxPage = data.total_pages;

  createMovie(movies, genericSection, {lazyLoad: true, clean: true});
}

async function getPaginatedTrendingMovies() {
  const { 
    scrollTop, 
    scrollHeight, 
    clientHeight } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 25)

    const pageIsNotMax = page < maxPage;

    if (scrollIsBottom && pageIsNotMax) {
      page++;
      const {data} = await api('trending/movie/day', {
        params: {
          page,
        }
      });

      maxPage = data.total_pages;
      console.log(maxPage)
      const movies = data.results;
      createMovie(movies, genericSection, {lazyLoad: true, clean: false});
    }
}




async function getMovieById(id){
  const {data: movie} = await api(`movie/${id}`);
  
  const movieImgPath = `https://image.tmdb.org/t/p/w300${movie.poster_path}`;

  headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%) , url(${movieImgPath})`;

  headerSection.style.backgroundPosition = 'center';
  headerSection.style.backgroundRepeat = 'no-repeat';
  headerSection.style.backgroundSize = 'cover';

  movieDetailTitle.textContent = movie.title;
  movieDetailDescription.textContent = movie.overview;
  movieDetailScore.textContent = movie.vote_average;


  createCategory(movie.genres, movieDetailCategoriesList);
}

async function getRelatedMoviesById(id){
  const {data} = await api(`movie/${id}/similar`);

  const relatedMovies = data.results;

  createMovie(relatedMovies, relatedMoviesContainer);

}
