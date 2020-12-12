import mongoose from 'mongoose'
const Schema = mongoose.Schema

const playlistSchema = new Schema({
  userID: String,
  name: String,
  music: { type : Array , "default" : [] }
})

export default mongoose.model('playlist', playlistSchema)