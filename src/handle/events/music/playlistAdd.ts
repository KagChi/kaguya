export default (client, message, queue, playlist) => {
    message.channel.send(`${playlist.title} has been added to the queue (${playlist.items.length} songs)!`)
}