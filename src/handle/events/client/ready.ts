export default (client) => {
    console.log(`${client.user.tag} Ready At ${client.guilds.cache.size} Guilds`);
    client.user.setActivity("WIP..",{type: 5, browser: "DISCORD IOS"})
}