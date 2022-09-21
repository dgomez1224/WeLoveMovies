const reviewsService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function reviewExists(req, res, next) {
    const {reviewId} = req.params;
    const review = await reviewsService.read(reviewId);
    if(review){
        res.locals.review = review;
        return next()
    }
    return next({
        status: 404,
        message: "Review cannot be found."
    })
}

async function list(req, res, next){
    res.json({data : await reviewsService.list()})
}

async function read(req , res, next){
    const {reviewId} = req.params;
    const data = await reviewsService.read(reviewId);
    res.json({ data }) 
}

async function update(req, res, next){
    const updatedReview = {
        ...req.body.data,
        review_id: res.locals.review.review_id
        
    }
    await reviewsService.update(updatedReview);
    const data = await reviewsService.newCritic(updatedReview.review_id);
    res.json({ data })
}

async function destroy(req, res, next) {
    reviewsService
        .delete(res.locals.review.review_id)
        .then(() => res.sendStatus(204))
        .catch(next)
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(reviewExists),read],
    update: [asyncErrorBoundary(reviewExists), update],
    delete: [asyncErrorBoundary(reviewExists), destroy]
}