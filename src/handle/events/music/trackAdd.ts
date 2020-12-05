export default (client, message, queue, track) => {
    message.channel.send(`${track.title} has been added to the queue!`)
} 