export type PlayerFilterOptions = {
    volume?: number;
    equalizer?: Array<PlayerEqualizerBand>;
    karaoke?: PlayerKaraokeOptions;
    timescale?: {
        speed?: number;
        pitch?: number;
        rate?: number;
    };
    tremolo?: {
        frequency?: number;
        depth?: number;
    };
    vibrato?: {
        frequency?: number;
        depth?: number;
    };
    rotation?: {
        rotationHz: number;
    };
    distortion?: {
        sinOffset?: number;
        sinScale?: number;
        cosOffset?: number;
        cosScale?: number;
        tanOffset?: number;
        tanScale?: number;
        offset?: number;
        scale?: number;
    };
    channelMix?: {
        leftToLeft?: number;
        leftToRight?: number;
        rightToLeft?: number;
        rightToRight?: number;
    };
    lowPass?: {
        smoothing: number;
    };
}

export type PlayerKaraokeOptions = {
    level?: number;
    monoLevel?: number;
    filterBand?: number;
    filterWidth?: number;
}

export type PlayerEqualizerBand = {
    band: number;
    gain: number;
}
