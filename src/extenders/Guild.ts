import { Structures, Iqueue } from 'discord.js-light'

class Guild extends Structures.get("Guild") {
    public queue: any = null;
}

declare module 'discord.js' {
    export interface Guild {
        queue: Iqueue
    }
}
Structures.extend("Guild", () => Guild);