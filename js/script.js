pinList = [];

function Movie() {
    return {
        id: '',
        title: '',
        img: '',
        date: ''
    };
};

function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}

$(document).ready(function() {

    var url = 'http://api.themoviedb.org/3/',
        key = '?api_key=82cffb223398a6c724b2f2935bc9a368',
        language = "&language=fr";

    $('#dialogList').dialog({ autoOpen: false, width: 500, maxHeight: 400, modal: true });
    $('#openListButton').click(function() {
        $('#dialogList').dialog('open');
    });
    
    $('#searchInput').keyup(function() {
        var input = $('#searchInput').val(),
            mode = 'search/movie',
            movieName = encodeURI(input);

        $("#searchInput").autocomplete({
            source: function(request, response) {
                $.ajax({
                    url: url + mode + key + language + '&query=' + movieName,
                    dataType: 'jsonp',
                    success: function(data) {
                        response($.map(data['results'], function(item) {
                            return {
                                label: item.title,
                                value: item.title,
                                id: item.id,
                                img: (item.poster_path != null ? "https://image.tmdb.org/t/p/w45_and_h67_bestv2" + item.poster_path : "images/default.jpg"),
                                date: (!isNaN(new Date(item.release_date).getFullYear()) ? new Date(item.release_date).getFullYear() : "Date de sortie inconnue")
                            };
                        }));
                    },
                    error: function (request, status, error) {
                        alert(request + ": " + status + ", " + error);
                    }
                });
            },
            select: function(e, ui) {
                var mode = 'movie/';
                var monthNames = ["janvier", "février", "mars", "avril", "mai", "juin",
                    "juillet", "août", "septembre", "octobre", "novembre", "décembre"
                ];

                $.ajax({
                    url: url + mode + ui["item"].id + key + language,
                    dataType: 'jsonp',
                    success: function (data) {

                        currentMovie = Movie();
                        currentMovie.id = data.id;
                        currentMovie.title = data.title;
                        currentMovie.img = (data.poster_path != null ? "https://image.tmdb.org/t/p/w45_and_h67_bestv2" + data.poster_path : "images/default.jpg");
                        var tempDate = new Date(data.release_date);
                        currentMovie.date = (!isNaN(tempDate.getFullYear()) ? tempDate.getDate() + ' ' + monthNames[tempDate.getMonth()] + ' ' + tempDate.getFullYear() : "Date de sortie inconnue");

                        if ($(".movieWrapper").is(':hidden'))
                            $(".movieWrapper").show();
                        $(".moviePoster").html("<img src='" + (data.poster_path != null ? "https://image.tmdb.org/t/p/w300_and_h450_bestv2" + data.poster_path : "images/default.jpg") + "' alt='poster'/>");
                        $(".movieTitle").html(data.title);

                        var release_date = new Date(data.release_date);

                        $(".movieDate").html("(" + (!isNaN(release_date.getFullYear()) ? release_date.getDate() + ' ' + monthNames[release_date.getMonth()] + ' ' + release_date.getFullYear() : "Date de sortie inconnue") + ")");

                        if(data.genres.length == 0)
                            $(".movieGenre").hide()
                        else {
                            $(".movieGenre").show();
                            var genresString = "";
                            $(data.genres).each(function(i) {
                                genresString += this.name + (i != data.genres.length - 1 ? ", " : "");
                            });
                            $(".genre").html(genresString);
                        }

                        if(!data.runtime)
                            $(".movieRuntime").hide()
                        else {
                            $(".movieRuntime").show();
                            $(".runtime").html(Math.floor( data.runtime / 60) + 'h ' + data.runtime % 60 + 'min');
                        }

                        if(!data.overview)
                            $(".movieOverview").hide()
                        else {
                            $(".movieOverview").show();
                            $(".overview").html(data.overview);
                        }

                    },
                    error: function (request, status, error) {
                        alert(request + ": " + status + ", " + error);
                    }
                });
            }
        }).data('ui-autocomplete')._renderItem = function(ul, item){
            return $("<li>")
                .append("<div class='imageWrapper'><img src='" + item.img + "' alt='img' width='45' height='67'/></div>")
                .append("<div class='textWrapper'><div class='textContent'><p class='title'>" + item.label + "</p><p class='date'>" + item.date + "</p></div></div>")
                .appendTo(ul);
        };
    });

    window.addFilmToList = function() {
        if(!containsObject(currentMovie, pinList)) {
            pinList.push(currentMovie);
            $("#ulDialog").append("<li class='liDialog row'>" +
                "<div class='posterDialog col-sm-2'><img src='" + currentMovie.img + "' alt='posterDialog' width='45' height='67'/></div>" +
                "<div class='textDialog col'><span class='textTitleDialog'>" + currentMovie.title + "</span><br/><span class='textDateDialog'>" + currentMovie.date + "</span></div>" +
                "</li>");
        }
        else
            alert("Le film est déjà dans la liste !");
    }
});