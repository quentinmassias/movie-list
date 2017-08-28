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
                                value: item.id
                            };
                        }));
                    },
                    error: function (request, status, error) {
                        alert(request + ": " + status + ", " + error);
                    }
                });
            }
        });
    });
});