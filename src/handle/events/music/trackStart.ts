export default (client, message, track) => {
    message.channel.send(`Now playing ${track.title}...`)
}