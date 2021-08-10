/** ORIGINAL CODE https://github.com/zhycorp/disc-11/blob/main/src/utils/createEmbed.ts */
import { MessageEmbed, Util } from 'discord.js';

const Color = {
    info: 'EE2677',
    warn: 'YELLOW',
    error: 'RED',
} as any
function CreateEmbed(color: string, message?: string) {
    const embed = new MessageEmbed()
    .setColor(Color[color])
    if (message) embed.setDescription(message);
    return embed;
}
export { CreateEmbed };