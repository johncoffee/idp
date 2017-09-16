import {Request, Response, Application} from "express";
import * as express from "express";
import {Candidate, filterCandidates, getPeople, Nationality, Rank, VesselType} from "./model/candidate";
import {join} from "path";

const app: Application = express()

app.get("/search/", (req:Request, res:Response) => {
  // console.log(req.query)

  const dest = Nationality[req.query.nationality] as any // destination affects flight prices
  const vesselType = VesselType[req.query.vesseltype] as any // vessel type filters
  const yearsTanker = req.query.yearstanker // filters out
  const rank = Rank[req.query.rank] as any // filters out
  const destDate = new Date(req.query.destDate) // affects people from

  const all:Candidate[] = getPeople()
  const candidates = filterCandidates(all, dest,
    rank, vesselType, yearsTanker, destDate)

  console.log(`results: ${candidates.length}`)

  const sortedByRating = candidates
    .map(p => {
      // just vanity: round to 3 decimals
      p.rating = Math.round(p.rating * 1000) / 1000
      p.flightToDestPrice = Math.round(p.flightToDestPrice * 100) / 100
      p.yearstanker = Math.round(p.yearstanker * 10) / 10
      return p
    })
    .map(p => {
      // view model
      return {
        personid: p.personid,
        rank: Rank[p.rank],
        nationality: Nationality[p.nationality],
        vesseltype: VesselType[p.vesselType],
        yearstanker: p.yearstanker,
        flightToDestPrice: `$ ${p.flightToDestPrice}`,
        rating: p.rating,
        assignenddate: p.assignEndDate,
        timeToVisa: Math.round(p.timeToVisa / 1000 / 60 / 60 / 24 * 10) / 10,
      }
    })

  res.json(sortedByRating)
})

app.use(express.static(join(__dirname, '../')))

app.listen(process.env.PORT || 8080)