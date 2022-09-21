const knex = require("../db/connection");
const mapProperties = require("../utils/map-properties");
const reduceProperties = require("../utils/reduce-properties")

const mapCritics = mapProperties({
    preferred_name: "critic.preferred_name",
    surname: "critic.surname",
    organization_name: "critic.organization_name",

})

const reduceCritics = reduceProperties("review_id",{
    preferred_name: ["critic", null, "preferred_name"],
    surname: ["critic", null, "surname"],
    organization_name: ["critic", null, "organization_name"],
});

function list() {
    return knex("reviews")
        .select("*")
}

function read(review_id) {
    return knex("reviews")
        .select("*")
        .where({review_id})
        .first()
}

function newCritic(review_id) {
    return knex("reviews as r")
        .join("critics as c", "c.critic_id", "r.critic_id")
        .select("r.*", "c.*")
        .where({review_id})
        .first()
        .then(mapCritics)
}

function update(updatedReview) {
    return knex("reviews")
        .select("*")
        .where({ review_id: updatedReview.review_id})
        .update(updatedReview, "*")
}

function destroy(review_id) {
    return knex("reviews")
        .where({review_id})
        .del()
}

module.exports = {
    list,
    read,
    update,
    newCritic,
    delete: destroy,
    mapCritics,
}