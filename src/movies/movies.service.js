const knex = require("../db/connection");
const {mapCritics} = require("../reviews/reviews.service")

function showingList(is_showing) {
    return knex("movies as m")
        .distinct()
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .select("m.movie_id as id", "m.title", "m.runtime_in_minutes","m.rating", "m.description", "m.image_url", "mt.is_showing")
        .where({"mt.is_showing": true})
}

function list() {
    return knex("movies").select("movie_id as id", "title", "runtime_in_minutes","rating", "description", "image_url")
}

function theaterList(movie_id) {
    return knex("movies as m")
        .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
        .join("theaters as t", "mt.theater_id", "t.theater_id")
        .select("t.*", "mt.is_showing", "m.movie_id")
        .where("m.movie_id", movie_id)
}

function reviewList(movie_id) {
    return knex("movies as m")
        .join("reviews as r", "m.movie_id", "r.movie_id")
        .join("critics as c", "r.critic_id", "c.critic_id" )
        .select("c.*", "r.*")
        .where("m.movie_id" , movie_id)
        .then(data => data.map(mapCritics))
        

}


function read(movieId) {
    return knex("movies")
        .select("*")
        .where({"movie_id": movieId})
        .first()
        
}

module.exports = {
    list,
    showingList,
    read,
    theaterList,
    reviewList,
}