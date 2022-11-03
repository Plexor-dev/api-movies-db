let maxPage;

let page = 1;

let infiniteScroll;

searchFormBtn.addEventListener('click', () => {
    location.hash = '#search=' + searchFormInput.value;
    });

trendingBtn.addEventListener('click', () => {
    location.hash = '#trends';
    });

arrowBtn.addEventListener('click', () => {
    history.back(); //devuelve al resultado anterior
    //location.hash = '#home';
    });

    

window.addEventListener('DOMContentLoaded', navigator, false);
window.addEventListener('hashchange', navigator, false);
window.addEventListener('scroll', infiniteScroll, false);


//se debe estar "escuchando" cuando el contenido cargue y cuando el contenido cambie para que se ejecute la funcion

function navigator() {
    console.log({location});

    if (infiniteScroll){
        window.removeEventListener('scroll', infiniteScroll, {passive: false});
        infiniteScroll = undefined;
    }

    if(location.hash.startsWith('#trends')){
        trendsPage();
    } else if (location.hash.startsWith('#search=')){
        searchPage();
    } else if (location.hash.startsWith('#movie=')){
        moviePage();
    } else if (location.hash.startsWith('#category=')){
        categoryPage();
    } else {
        homePage();
    }
    window.scrollTo(0, 0);

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    if (infiniteScroll){
        window.addEventListener('scroll', infiniteScroll, {passive: false});
    }
}

function homePage() {
    console.log('Home!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerCategoryTitle.classList.add('inactive');
    headerTitle.classList.remove('inactive');
    searchForm.classList.remove('inactive');
    likedMoviesSection.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');

    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');



    getTrendingMoviesPreview();
    getCategoriesMoviesPreview();
    getLikedMovie();
}

function categoryPage() {
    console.log('Category!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerCategoryTitle.classList.remove('inactive');
    headerTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');


    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');

    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, categoryData] = location.hash.split('=') //esto va a devolver => ['#category', 'id-name']

    const [categoryId, categoryName] = categoryData.split('-')

    headerCategoryTitle.innerHTML = categoryName;

    getMoviesbyCategory(categoryId);

    infiniteScroll = getPaginatedMoviesbyCategory(categoryId);
}

function moviePage(){
    console.log('Movie!!');

    headerSection.classList.add('header-container--long');
    //headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');



    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');

    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_, movieId] = location.hash.split('=') //esto va a devolver => ['#search', 'buscado']
    getMovieById(movieId)
    getRelatedMoviesById(movieId)

}

function searchPage(){
    console.log('Search!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerCategoryTitle.classList.add('inactive');
    headerTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');
    likedMoviesSection.classList.add('inactive');



    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');

    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, query] = location.hash.split('=') //esto va a devolver => ['#search', 'buscado']
    getMoviesBySearch(query)

    infiniteScroll = getPaginatedMoviesBySearch(query);

}

function trendsPage(){
    console.log('Trends!!');

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerCategoryTitle.classList.remove('inactive');
    headerTitle.classList.add('inactive');
    searchForm.classList.add('inactive');
    likedMoviesSection.classList.add('inactive');



    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');

    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerHTML = 'Trending';

    getTrendingMovies()

    infiniteScroll = getPaginatedTrendingMovies;
}

//const $ = (id) => document.querySelector(id);
