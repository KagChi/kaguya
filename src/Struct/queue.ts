import { tracks } from "track-resolver";

export class queue extends Array<tracks> {
    public current: tracks | null | undefined = null;
    public add(track: tracks | tracks[]) {
        if (!this.current) {
            if (!Array.isArray(track)) {
                this.current = track;
                return;
            } else {
                this.current = (track = [...track]).shift();
            }
        }
        if (Array.isArray(track)) this.push(...track);
        else this.push(track);
    }

    public get totalSize(): number {
        return this.length + (this.current ? 1 : 0);
    }

    public clear(): void {
        this.splice(0);
    }

    public shuffle(): void {
        for (let i = this.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this[i], this[j]] = [this[j], this[i]];
        }
    }
}