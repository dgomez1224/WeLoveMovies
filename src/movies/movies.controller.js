const moviesService = require("./movies.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")


async function movieExists(req, res, next) {
    const {movieId} = req.params;
    const movie = await moviesService.read(movieId);
    if(movie){
        res.locals.movie = movie;
        return next()
    }
    return next({
        status: 404,
        message: "Movie cannot be found."
    })
}

async function theaterList(req, res, next) {
    const movie_id = req.params.movieId ;
    res.json({ data : await moviesService.theaterList(movie_id)})
}

async function reviewList(req , res, next) {
    const movie_id = req.params.movieId;
    const response = await moviesService.reviewList(movie_id);
    res.json({ data : response })
}

async function list(req, res, next) {
    const {is_showing} = req.query
    if(is_showing === 'true'){
        res.json({ data: await moviesService.showingList(is_showing) })
    }
    res.json({ data: await moviesService.list() }) 
    }

async function read(req, res, next) {
    const { movie } = res.locals;
    res.json( { data : movie})
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(movieExists), read],
    theaterList: [asyncErrorBoundary(movieExists), asyncErrorBoundary(theaterList)],
    reviewList: [asyncErrorBoundary(movieExists), asyncErrorBoundary(reviewList)]
}