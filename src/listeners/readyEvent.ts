import Listener from "../structures/Listener";
const mongoose = require("mongoose");
export default class ReadyEvent extends Listener {
    public name = "ready";
    public exec(): void {
        console.log(`Logged in as ${this.client.user!.tag}`);
        mongoose.connect(process.env.mongodb,{ useNewUrlParser: true, useUnifiedTopology: true })
        const dbMongo = mongoose.connection
        dbMongo.on('error', () => {
            console.log('mongodb error!')
        })
        // successful connection
        dbMongo.once('open', () => {
            console.log('mongodb connected!')
        })
    }
}