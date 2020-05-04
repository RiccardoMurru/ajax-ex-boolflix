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

$(document).ready(function () {

    /***********
    * Referenze
    ************/

    var searchInput = $('.search-bar');
    var searchBtn = $('.search-button');

    // Handlebars init
    var source = $('#movie-template').html();
    var template = Handlebars.compile(source);

    /********************
    * Main functionality
    *********************/

    // Ricerca a click su bottone
    searchBtn.click(function() {
        var searchTitle = searchInput.val().trim();
        movieRequest(searchTitle, template);
    });


}); // end doc ready

/***********
* Functions
************/

// Ajax request
function movieRequest(search, template) {
    $.ajax({
        url: "https://api.themoviedb.org/3/search/movie",
        method: 'GET',
        data: {
            api_key: '87b0eb1d0f76dae2472919c6cdf66278',
            query: search,
            language: 'it-IT'
        },
        success: function (response) {
            // pulizia dati film
            $('.movie-container').html('');
            for (var i = 0; i < response.results.length; i++) {
                var movie = response.results[i];
                printTemplate(movie, template);
            }
        },
        error: function() {
            console.log('Request error');
        }
    });
};

// Handlebars print template
function printTemplate(item, template) {
    var context = {
        title: item.title,
        'original-title': item.original_title,
        language: item.original_language,
        rating: item.vote_average
    }

    var output = template(context);
    $('.movie-container').append(output);
};