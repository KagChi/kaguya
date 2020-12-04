const { economyDb } = require('../handle/mongoConnect')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const economySchema = new Schema({
  userID: Number,
  eris: Number,
  yen: Number,
  daily: Number,
  weekly: Number,
  monthly: Number,
  work: Number,
  fish: Number
  })
export default economyDb.model('coins', economySchema)
