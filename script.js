const movies = document.querySelector('.movies');
let paginationcards = 0;
const nextButton = document.querySelector('.btn-next');
const previusButton = document.querySelector('.btn-prev');
const input = document.querySelector('.input');
const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');
const highlightVideoLink = document.querySelector('.highlight__video-link');
const movieModal = document.querySelector('.modal');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalAverage = document.querySelector('.modal__average');
const modalClose = document.querySelector('.modal__close');
const btnTheme = document.querySelector('.btn-theme');
const root = document.querySelector(':root');
const body = document.querySelector('body');
let response = [];

function setTheme() {
    const theme = localStorage.getItem('theme', 'light');

    if (theme === 'light' || !theme) {
        root.style.setProperty('--background', '#fff');
        root.style.setProperty('--input-color', '#979797')
        root.style.setProperty('--text-color', '#1b2028')
        body.style.setProperty('--bg-secondary', '#ededed')

        btnTheme.src = './assets/light-mode.svg';
        btnTheme.alt = 'theme-light';
        nextButton.src = './assets/arrow-right-dark.svg';
        previusButton.src = './assets/arrow-left-dark.svg';
        modalClose.src = './assets/close-dark.svg';

    } else {
        root.style.setProperty('--background', '#1b2028');
        root.style.setProperty('--input-color', '#fff')
        root.style.setProperty('--text-color', '#fff')
        body.style.setProperty('--bg-secondary', '#2D3440')

        btnTheme.src = './assets/dark-mode.svg';
        btnTheme.alt = 'theme-dark';
        nextButton.src = './assets/arrow-right-light.svg'
        previusButton.src = './assets/arrow-left-light.svg'
        modalClose.src = './assets/close.svg';
    }

}

setTheme();

btnTheme.addEventListener('click', (event) => {
    let theme = localStorage.getItem('theme');

    theme === 'dark' ? localStorage.setItem('theme', 'light') : localStorage.setItem('theme', 'dark');

    setTheme();

});

async function moviesData(search) {

    if (search) {
        response = await api.get(`/search/movie?language=pt-BR&include_adult=false&query=${search}`);
    } else {
        response = await api.get('/discover/movie');
    }

    for (let i = paginationcards; i < paginationcards + 6; i++) {
        const divMovies = document.createElement('div');
        divMovies.classList.add('movie');
        divMovies.style.backgroundImage = `URL(https://image.tmdb.org/t/p/original${response.data.results[i].poster_path})`;

        divMovies.addEventListener('click', () => showModal(response.data.results[i]));


        const movieInfo = document.createElement('div');
        movieInfo.classList.add('movie__info');

        divMovies.appendChild(movieInfo);

        const movieTitle = document.createElement('span');
        movieTitle.classList.add('movie__title');
        movieTitle.textContent = response.data.results[i].title;

        movieInfo.appendChild(movieTitle);

        const movieRating = document.createElement('span');
        movieRating.classList.add('movie__rating');
        movieRating.textContent = response.data.results[i].vote_average;

        movieInfo.appendChild(movieRating);

        const stars = document.createElement('img');
        stars.src = './assets/estrela.svg';

        movieRating.appendChild(stars);

        movies.appendChild(divMovies);

    }
}
moviesData();


nextButton.onclick = () => {
    if (paginationcards === 12) {
        paginationcards = 0;
    } else {
        paginationcards += 6;
    }
    movies.innerHTML = '';


    if (input.value) {
        moviesData(input.value);
    } else {
        moviesData();
    }
}

previusButton.onclick = () => {
    if (paginationcards === 0) {
        paginationcards = 12;
    } else {
        paginationcards -= 6;
    }

    movies.innerHTML = '';

    if (input.value) {
        moviesData(input.value);

    } else {
        moviesData();

    }
}

input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') {
        return;
    }

    paginationcards = 0;
    movies.innerHTML = '';

    if (!input.value) {
        moviesData();
    } else {
        moviesData(input.value);
    }
});

async function dayMovie() {
    const response = await api.get('/movie/436969?language=pt-BR');
    const responseVideo = await api.get('/movie/436969/videos?language=pt-BR');

    const arrayGenres = []

    for (const genre of response.data.genres) {
        arrayGenres.push(genre.name);
    }

    const formatDay = new Date(response.data.release_date);

    const newFormat = formatDay.toLocaleDateString('pt-br', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })

    highlightVideo.style.backgroundImage = `URL(${response.data.backdrop_path})`;
    highlightVideo.style.backgroundSize = 'cover';
    highlightTitle.textContent = response.data.title;
    highlightRating.textContent = Number(response.data.vote_average).toFixed(1);
    highlightGenres.textContent = arrayGenres.join(', ');
    highlightLaunch.textContent = newFormat;
    highlightDescription.textContent = response.data.overview;
    highlightVideoLink.href = `https://www.youtube.com/watch?v=${responseVideo.data.results[1].key}`
}

dayMovie()

async function showModal(arrayMovies) {
    const response = await api.get(`/movie/${arrayMovies.id}?language=pt-BR`)

    movieModal.classList.remove('hidden');
    modalTitle.textContent = response.data.title;
    modalImg.src = response.data.backdrop_path;
    modalDescription.textContent = response.data.overview;
    modalAverage.textContent = Number(response.data.vote_average).toFixed(1);

    modalClose.addEventListener('click', () => {
        movieModal.classList.add('hidden');
    })

    movieModal.addEventListener('click', () => {
        movieModal.classList.add('hidden');
    })
}
