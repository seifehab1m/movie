/// <reference path="../typings/globals/jquery/index.d.ts" />

let filmsResponse;
let searchFilms = [];
let itemSelected = {
    "Now Playing": "now_playing",
    "Popular": "popular",
    "Top Rated": "top_rated",
    "Trending": "trending",
    "Upcoming": "upcoming",
}
let rowData = document.getElementById("rowData");
let regex = {
    name: /^[a-z]{3,10}$/,
    email: /^\w{3,10}@[a-z]{3,7}.com$/,
    phone: /^01[0-9]{9}$/,
    age: /^[1-9][0-9]$/,
    password: /^[A-Z]\w{6,10}$/,
    rePassword: /^[A-Z]\w{6,10}$/,
}

$(document).ready(function () {

    $(".loading").fadeOut(2000, function () {
        $(".loading").css({
            'cssText': 'display: none !important'
        }, 1000);
        $("body").css("overflow", "auto")
    });


})


//*--------------------------- Search Api -------------------- */
$("#movieApi").keyup(function () {
    let wordSearch = $("#movieApi").val();
    if (wordSearch != "") {
        searchApi(wordSearch)
    }


})
async function searchApi(wordSearch) {

    let response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=eba8b9a7199efdcb0ca1f96879b83c44&fbclid&language=en-US&page=1&include_adult=false&query=${wordSearch}`)
    filmsResponse = await response.json()
    displayfilms(filmsResponse.results)
}


//*--------------------------- Search in page -------------------- */



$("#movieInPage").keyup(function () {
    searchFilms = [];
    let filmsResponseResults = filmsResponse.results

    let wordSearchPage = $(this).val().toLowerCase()
    //    console.log(wordSearchPage);
    //    console.log(filmsResponseResults);
    for (let i = 0; i < filmsResponseResults.length; i++) {


        if ((filmsResponseResults[i].original_title) != undefined) {
            if (filmsResponseResults[i].original_title.toLowerCase().includes(wordSearchPage))
                searchFilms.push(filmsResponseResults[i]);
        }
        else {
            if (filmsResponseResults[i].original_name.toLowerCase().includes(wordSearchPage))
                searchFilms.push(filmsResponseResults[i]);
        }
    }
    displayfilms(searchFilms)
})


//---------------- toggle menu --------------------




$(".toggleMenu i").click(function () {
    let navLeft = $(".sideNAv").css("left")


    if (navLeft == "-200px") {

        $(".sideNAv").animate({ left: 0 }, 400)
        $("ul li").animate({ "padding-top": 0 }, 800)
        $("ul li").animate({ "opacity": 1 }, 800)
        $(".fa-xmark").css("display", "block")
        $(".fa-align-justify").css("display", "none")
    }

    else {
        $(".sideNAv").animate({ left: -200 }, 400)
        $("ul li").animate({ "padding-top": 400 })
        $(".fa-xmark").css("display", "none")
        $(".fa-align-justify").css("display", "block")
    }
})

getFilm("now_playing")
$("ul li a").click(function () {
    let film = itemSelected[$(this).text()];
    if ($(this).text() != "Contact Us") {
        $("h1").text($(this).text())

    }
    if (film != undefined) {
        getFilm(film)

    }
})

async function getFilm(film) {
    let response;
    if (film == "trending") {

        response = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=eba8b9a7199efdcb0ca1f96879b83c44&fbclid=IwAR3QVfI8v1sj1GfDCLUdeza5icWjOWeI70frYWBhztgZU1lLChJgvu7GAFM`)
    }
    else {
        response = await fetch(`https://api.themoviedb.org/3/movie/${film}?api_key=eba8b9a7199efdcb0ca1f96879b83c44&fbclid&language=en-US&page=1`)
    }
    filmsResponse = await response.json()



    displayfilms(await filmsResponse.results);

}
function displayfilms(filmsResponse) {

    let temp = ""
    for (let i = 0; i < filmsResponse.length; i++) {
        temp += `<div class="col-md-4 ml">
        <div class="layer position-relative text-center ">
            <img src="https://image.tmdb.org/t/p/w500/${(filmsResponse[i].poster_path == undefined) ? filmsResponse[i].backdrop_path : filmsResponse[i].poster_path}" class="w-100" alt="">
            <div class="details d-flex justify-content-center align-items-center ">
                <div>
                    <h2>${(filmsResponse[i].original_title == undefined) ? filmsResponse[i].original_name : filmsResponse[i].original_title}</h2>
                    <p>${filmsResponse[i].overview}</p>
                    <p>rate: ${filmsResponse[i].vote_average}</p>
                    <p>${(filmsResponse[i].release_date == undefined) ? filmsResponse[i].first_air_date : filmsResponse[i].release_date}</p>
                </div>
            </div>
        </div>
    </div>`
    }
    rowData.innerHTML = temp;
}

//*--------------------------- contact us -------------------- */
$(".contact input").keyup(function () {

    let getRegex = regex[$(this).attr("id")]
    let check = getRegex.test($(this).val());

    if ($(this).attr("id") != "rePassword") {
        if (check == false) {
            displayAlert($(this))

        }
        else {
            hideAlert($(this))
        }
    }
    else {
        if ($(this).val() != $("#password").val()) {
            displayAlert($(this))
        }
        else {
            hideAlert($(this))
        }
    }
})

function displayAlert(input) {
    input.next().css({
        'cssText': 'display: block !important'
    });
}

function hideAlert(input) {
    input.next().css({
        'cssText': 'display: none !important'
    });
}

