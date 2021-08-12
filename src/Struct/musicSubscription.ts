import {
    AudioPlayer,
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    entersState,
    VoiceConnection,
    VoiceConnectionDisconnectReason,
    VoiceConnectionStatus,
    createAudioResource,
    demuxProbe,
    StreamType,
    PlayerSubscription
} from '@discordjs/voice';
import { raw as ytdl } from 'youtube-dl-exec';
import { tracks } from 'track-resolver';
import kaguyaPlayer from './playerHandler';
import { FFmpeg } from 'prism-media';

export class musicSubscription {
    public readonly voiceConnection: VoiceConnection;
    public audioPlayer: AudioPlayer | undefined;
    public _filters = [];
    public _currentTrack: tracks | undefined;
    public initial = false;
    private readyLock = false;
    private _currentResource: AudioResource | null = null;
    private subscription: PlayerSubscription | undefined;
    public constructor(voiceConnection: VoiceConnection, public player: kaguyaPlayer) {
        this.voiceConnection = voiceConnection;
        this.voiceConnection.on("stateChange", async (_, newState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    try {
                        await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting,  5000);
                    } catch {
                        this.voiceConnection.destroy();
                    }
                } else if (this.voiceConnection.rejoinAttempts < 5) {
                    await musicSubscription.wait((this.voiceConnection.rejoinAttempts + 1) * 5000);
                    this.voiceConnection.rejoin();
                } else {
                    this.voiceConnection.destroy();
                }
            } else if (newState.status === VoiceConnectionStatus.Destroyed) {
                this.stop();
            } else if (!this.readyLock && (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling)) {
                this.readyLock = true;
                try {
                    await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 5000);
                } catch {
                    if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) this.voiceConnection.destroy();
                } finally {
                    this.readyLock = false;
                }
            }
        });
    }

    static wait(time: number) {
        return new Promise((r) => setTimeout(r, time).unref());
    }

    public async createStream(track: tracks): Promise<AudioResource<tracks>> {
        switch (track.sourceName) {
            default:
                return new Promise((resolve, reject) => {
                    const process = ytdl(
                        track.uri,
                        {
                            o: '-',
                            q: '',
                            f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
                            r: '100K',
                        },
                        { stdio: ['ignore', 'pipe', 'ignore'] },
                    );
                    if (!process.stdout) {
                        reject(new Error('No stdout'));
                        return;
                    }
                    const stream = process.stdout;
                    const onError = (error: Error) => {
                        if (!process.killed) process.kill();
                        stream.resume();
                        reject(error);
                    };
                    this._currentTrack = track;
                    process
                        .once('spawn', () => {
                            let isRaw = false;
                            let final;
                            if (this._filters.length) {
                                const toApply = ["-i", "-", "-analyzeduration", "0", "-loglevel", "0", "-f", "s16le", "-ar", "48000", "-ac", "2"];
                                if (this._filters.length) toApply.push("-af");
                                const argus = toApply.concat(this._filters);
                                const transcoder = new FFmpeg({ args: argus });
                                
                                final = stream.pipe(transcoder);

                                final.once("close", () => {
                                    transcoder.destroy();
                                });
                                final.once("end", () => {
                                    transcoder.destroy();
                                });
                                isRaw = true;
                            } else {
                                final = stream;
                            }
                            if (isRaw) resolve(createAudioResource(final, { metadata: track, inputType: StreamType.Raw, inlineVolume: true }))
                            else demuxProbe(final)
                                .then((probe) => resolve(createAudioResource(probe.stream, { metadata: track, inputType: probe.type, inlineVolume: true })))
                                .catch(onError);
                        })
                        .catch(onError);
                });
                break;
        }
    }


    public async play(track: tracks) {
        const stream = await this.createStream(track);
        this._currentResource = stream
        const newPlayer = createAudioPlayer();
        this._applyPlayerEvents(newPlayer);
        newPlayer.play(stream);
        this.initial = true;
    }

    public _applyPlayerEvents(player: AudioPlayer) {
        const old = this.audioPlayer;
        if (old) {
            const stateChangeListeners = old.listeners("stateChange"); // all player listeners internally in djs voice should be added already unless something weird happens where they're added on another tick
            old.removeListener("stateChange", stateChangeListeners[0]); // no listeners should be added in the constructor. This method is called in the next tick
        }
        player.on("stateChange", async (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                // If the Idle state is entered from a non-Idle state, it means that an audio resource has finished playing.
				// The queue is then processed to start playing the next track, if one is available.
                if (this._currentTrack) this.player.client.music.emit('trackEnd', this.player, this._currentTrack)
            } else if (newState.status === AudioPlayerStatus.Playing) {
				// If the Playing state has been entered, then a new track has started playback.
                this.audioPlayer = player;
                this.subscription?.unsubscribe();
                old?.stop(true);
                old?.removeAllListeners();
                this.subscription = this.voiceConnection.subscribe(this.audioPlayer);
                if (this.initial && this._currentTrack) {
                    this.player.client.music.emit('trackStart', this.player, this._currentTrack)
                    this._currentResource = null;
                    this.initial = false
                } 
            }
           
        })
    }

    public stop(force?: boolean) {
        this.audioPlayer?.stop(force);
    }

    get volume() {
        if (!this._currentResource || !this._currentResource.volume) return 100;
        const currentVol = this._currentResource.volume.volume;
        return Math.round(Math.pow(currentVol, 1 / 1.660964) * 100);
    }

    setVolume(value: number) {
        if (!this._currentResource || isNaN(value) || value < 0 || value > Infinity) return false;
        this._currentResource.volume?.setVolumeLogarithmic(value / 100);
        return true;
    }

    get streamTime() {
        if (!this._currentResource) return 0;
        return this._currentResource?.playbackDuration;
    }

    public destroy() {
        this.stop(true);
        this.voiceConnection.destroy();
    }

}