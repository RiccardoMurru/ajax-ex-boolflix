/** 
* Milestone 1:
* Creare un layout base con una searchbar (una input e un button) 
* in cui possiamo scrivere completamente o parzialmente il nome di un film. 
* Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
* Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato: 
*  - Titolo
*  - Titolo Originale
*  - Lingua Originale
*  - Voto (media)
* Utilizzare un template Handlebars per mostrare ogni singolo film trovato.
*/

/**
* Milestone 2:
* Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, 
* così da permetterci di stampare a schermo un numero di stelle piene 
* che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
* Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene
* Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, 
* gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API.
* Allarghiamo poi la ricerca anche alle serie tv.
*/

$(document).ready(function () {

    /***********
    * Referenze
    ************/

    var searchInput = $('.search-bar');
    var searchBtn = $('.search-button');
    var movieList = $('.movie-container');
    var moviesApi = {
        url: 'https://api.themoviedb.org/3/search/movie',
        api_key: '87b0eb1d0f76dae2472919c6cdf66278',
        language: 'it-IT',
        type: 'Film'
    };
    var seriesApi = {
        url: 'https://api.themoviedb.org/3/search/tv',
        api_key: '87b0eb1d0f76dae2472919c6cdf66278',
        language: 'it-IT',
        type: 'Serie TV'
    };

    // Handlebars init
    var source = $('#movie-template').html();
    var template = Handlebars.compile(source);

    /********************
    * Main functionality
    *********************/

    // Ricerca a click su bottone
    searchBtn.click(function() {
        var searchTitle = searchInput.val().trim();
        cleanUp(movieList);
        apiRequest(searchTitle, moviesApi, template, movieList, searchInput);
        apiRequest(searchTitle, seriesApi, template, movieList, searchInput);
    });


}); // end doc ready

/***********
* Functions
************/

// Ajax movie request
function apiRequest(search, apiData, template, container, inputBar) {
    $.ajax({
        url: apiData.url,
        method: 'GET',
        data: {
            api_key: apiData.api_key,
            query: search,
            language: apiData.language
        },
        success: function (response) {
            var movies = response.results;

            if (movies.length > 0) {
                print(movies, template, container, apiData.type);
            } else {
                console.log('Nessun risultato');
            }
            inputBar.select();
        },
        error: function() {
            console.log('Request error');
        }
    });
};

// Handlebars print template
function print(movies, template, container, type) {
    var title, originalTitle;

    for (var i = 0; i < movies.length; i++) {
        var item = movies[i];
        if (type === 'Film') {
            title = item.title;
            originalTitle = item.original_title;
        } else if (type === 'Serie TV') {
            title = item.name;
            originalTitle = item.original_name;
        }
        var posterPath = {
            baseUrl: 'https://image.tmdb.org/t/p/',
            width: 'w342',
            imageUrl: item.poster_path
        };

        var poster = posterPath.baseUrl + posterPath.width + posterPath.imageUrl;

        var context = {
            title: title,
            'original-title': originalTitle,
            language: languageFlag(item.original_language),
            rating: stars(item.vote_average),
            type: type,
            poster: poster,
            overview: item.overview.substr(0, 150) + '...'

        }
        var output = template(context);
        container.append(output);
    } 

    console.log(posterPath);
    
};

// pulizia dati ricerche precedenti
function cleanUp(container) {
    container.html('');
};

// trasforma la media voti in stelle da 1 a 5
function stars(vote) {
    var res = '';
    var fullStar = '<i class="fas fa-star"></i>';
    var emptyStar = '<i class="far fa-star"></i>';

    switch (Math.ceil(vote / 2)) {
        case 1:
            res = fullStar + (emptyStar.repeat(4));
            break;
        case 2:
            res = (fullStar.repeat(2)) + (emptyStar.repeat(3));
            break;
        case 3:
            res = (fullStar.repeat(3)) + (emptyStar.repeat(2));
            break;
        case 4:
            res = (fullStar.repeat(4)) + emptyStar;
            break;
        case 5:
            res = fullStar.repeat(5);
            break;
        default:
            res = emptyStar.repeat(5);
            break;
    };
    return res;
};

// cambio lingua in bandiera (it - en)
function languageFlag(language) {
    var res = '';
    switch (language) {
        case 'it':
            res = '<img class="flag" src="assets/img/it.svg" alt="IT">';
            break;
        case 'en':
            res = '<img class="flag" src="assets/img/en.svg" alt="EN">';
            break;
        default:
            res = language;
            break;
    };
    return res;
};