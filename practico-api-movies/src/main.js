const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    headers: {
        'Content-Type': 'application/json'
    },
    params: {
        'api_key': API_KEY,
    }
})


//Utils

function createMovie(movies,container) {
  container.innerHTML = '';

  movies.forEach(m => {//console.log(m.title)
  const movieContainer = document.createElement('div');
  movieContainer.classList.add('movie-container');
  movieContainer.addEventListener('click', () => {
    location.hash = `#movie=${m.id}`;
  })

  const movieImg = document.createElement('img');
  movieImg.classList.add('movie-img');
  movieImg.setAttribute('alt', m.title);

  movieImg.setAttribute('src', `https://image.tmdb.org/t/p/w300${m.poster_path}`);

  movieContainer.appendChild(movieImg);
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





//!Llamados a la API


async function getTrendingMoviesPreview(){
    const {data} = await api('trending/movie/day');
    const movies = data.results;

    createMovie(movies, trendingMoviesPreviewList);

    console.log({data, movies });
}

async function getCategoriesMoviesPreview(){
    const {data} = await api('genre/movie/list');

    const categories = data.genres;
    console.log({data, categories});
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
    console.log({data, movies });

    createMovie(movies, genericSection);
}

async function getMoviesBySearch(query){
    const {data} = await api('search/movie', {
    params: {
    query,
   }
 }
);
    const movies = data.results;
    console.log({data, movies });

    createMovie(movies, genericSection);
}

async function getTrendingMovies(){
  const {data} = await api('trending/movie/day');
  const movies = data.results;

  createMovie(movies, genericSection);

  console.log({data, movies });
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
