"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var candidate_1 = require("./model/candidate");
var path_1 = require("path");
var app = express();
app.get("/search/", function (req, res) {
    // console.log(req.query)
    var dest = candidate_1.Nationality[req.query.nationality]; // destination affects flight prices
    var vesselType = candidate_1.VesselType[req.query.vesseltype]; // vessel type filters
    var yearsTanker = req.query.yearstanker; // filters out
    var rank = candidate_1.Rank[req.query.rank]; // filters out
    var destDate = new Date(req.query.destDate); // affects people from
    var all = candidate_1.getPeople();
    var candidates = candidate_1.filterCandidates(all, dest, rank, vesselType, yearsTanker, destDate);
    console.log("results: " + candidates.length);
    var sortedByRating = candidates
        .map(function (p) {
        // just vanity: round to 3 decimals
        p.rating = Math.round(p.rating * 1000) / 1000;
        p.flightToDestPrice = Math.round(p.flightToDestPrice * 100) / 100;
        p.yearstanker = Math.round(p.yearstanker * 10) / 10;
        return p;
    })
        .map(function (p) {
        // view model
        return {
            personid: p.personid,
            rank: candidate_1.Rank[p.rank],
            nationality: candidate_1.Nationality[p.nationality],
            vesseltype: candidate_1.VesselType[p.vesselType],
            yearstanker: p.yearstanker,
            flightToDestPrice: "$ " + p.flightToDestPrice,
            rating: p.rating,
            assignenddate: p.assignEndDate,
            timeToVisa: Math.round(p.timeToVisa / 1000 / 60 / 60 / 24 * 10) / 10,
        };
    });
    res.json(sortedByRating);
});
app.use(express.static(path_1.join(__dirname, '../')));
app.listen(process.env.PORT || 8080);
