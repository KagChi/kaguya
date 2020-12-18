import { Structures, Iqueue } from 'discord.js-light'
class Guild extends Structures.get("Guild") {
    public queue: Iqueue | null = null
}