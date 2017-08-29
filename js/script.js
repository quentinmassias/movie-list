$(document).ready(function() {
    var url = 'http://api.themoviedb.org/3/',
        mode = 'search/movie',
        input,
        movieName,
        movies = [],
        key = '?api_key=82cffb223398a6c724b2f2935bc9a368';



    $('#searchInput').keyup(function() {
        var input = $('#searchInput').val(),
            movieName = encodeURI(input);
        movies = [];

        $("#searchInput").autocomplete({
            source: function(request, response) {
                $.ajax({
                    url: url + mode + key + '&query=' + movieName,
                    dataType: 'jsonp',
                    success: function(data) {
                        response($.map(data['results'], function(item) {
                            return {
                                label: item.title,
                                value: item.id,
                                img: (item.poster_path != null ? "https://image.tmdb.org/t/p/w45_and_h67_bestv2" + item.poster_path : "img/default.jpg"),
                                date: (!isNaN(new Date(item.release_date).getFullYear()) ? new Date(item.release_date).getFullYear() : "")
                            };
                        }));
                    },
                    error: function (request, status, error) {
                        alert(request + ": " + status + ", " + error);
                    }
                });
            }
        }).data('ui-autocomplete')._renderItem = function(ul, item){
            console.log(item);
            return $("<li>")
                .append("<div class='imageWrapper'><img src='" + item.img + "' alt='img' width='45' height='67'/></div>")
                .append("<div class='textWrapper'><div class='textContent'><p class='title'>" + item.label + "</p><p class='date'>" + item.date + "</p></div></div>")
                .appendTo(ul);
        };
    });
});