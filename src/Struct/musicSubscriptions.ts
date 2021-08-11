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
    StreamType
} from '@discordjs/voice';
import { raw as ytdl } from 'youtube-dl-exec';
import { tracks } from 'track-resolver';
import kaguyaPlayer from './playerHandler';
import { FFmpeg } from 'prism-media';

export class musicSubscriptions {
    public readonly voiceConnection: VoiceConnection;
    public readonly audioPlayer: AudioPlayer;
    public _filters = [];
    public _currentTrack: tracks | undefined;
    public initial = false;
    public constructor(voiceConnection: VoiceConnection, public player: kaguyaPlayer) {
        this.voiceConnection = voiceConnection;
        this.audioPlayer = createAudioPlayer();
        this.voiceConnection.on("stateChange", async (oldState, newState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    try {
                        await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5000);
                    } catch {
                        this.player.client.music.emit('WebSocketClosedEvent', (this.player, newState.closeCode))
                        this.destroy();
                    }
                } else {
                    if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose) this.player.client.music.emit('WebSocketClosedEvent', (this.player, newState.closeCode))
                    this.stop();
                }
            } else if (newState.status === VoiceConnectionStatus.Destroyed) {
                this.stop();
            } else if (newState.status === VoiceConnectionStatus.Connecting || newState.status === VoiceConnectionStatus.Signalling) {
                try {
                    await entersState(this.voiceConnection, VoiceConnectionStatus.Ready, 20000);
                } catch {
                    if (this.voiceConnection.state.status !== VoiceConnectionStatus.Destroyed) this.destroy();
                }
            }
        })
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
        this._applyPlayerEvents(this.audioPlayer);
        this.audioPlayer.play(stream);
        this.initial = true;
    }

    public _applyPlayerEvents(player: AudioPlayer) {
        player.on("stateChange", async (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                // If the Idle state is entered from a non-Idle state, it means that an audio resource has finished playing.
				// The queue is then processed to start playing the next track, if one is available.
                if (this._currentTrack) this.player.client.music.emit('trackEnd', this.player, this._currentTrack)
            } else if (newState.status === AudioPlayerStatus.Playing) {
				// If the Playing state has been entered, then a new track has started playback.
                if (this.initial && this._currentTrack) this.player.client.music.emit('trackStart', this.player, this._currentTrack)
                this.initial = false
            }
            this.voiceConnection.subscribe(this.audioPlayer);
        })
    }

    public stop(destroyed?: boolean) {
        this.audioPlayer.stop(true);
    }

    public destroy() {
        this.stop(true);
        this.voiceConnection.destroy();
    }

}