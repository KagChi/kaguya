import {
    AudioPlayer,
    AudioPlayerStatus,
    AudioResource,
    createAudioPlayer,
    entersState,
    VoiceConnection,
    VoiceConnectionDisconnectReason,
    VoiceConnectionStatus,
    StreamType,
    createAudioResource,
    demuxProbe
} from '@discordjs/voice';
import { promisify } from 'util';
import { raw as ytdl } from 'youtube-dl-exec';
import { tracks } from 'track-resolver';
import kaguyaPlayer from './playerHandler';
const wait = promisify(setTimeout);


export class musicSubscriptions {
    public readonly voiceConnection: VoiceConnection;
    public readonly audioPlayer: AudioPlayer;
    public queueLock = false;
    public readyLock = false;
    public _filters = [];
    public constructor(voiceConnection: VoiceConnection, public player: kaguyaPlayer) {
        this.voiceConnection = voiceConnection;
        this.audioPlayer = createAudioPlayer();
        this.voiceConnection.on("stateChange", async (oldState, newState) => {
            if (newState.status === VoiceConnectionStatus.Disconnected) {
                if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                    try {
                        await entersState(this.voiceConnection, VoiceConnectionStatus.Connecting, 5000);
                    } catch {
                        //parentPort.postMessage({ op: Constants.workerOPCodes.MESSAGE, data: { op: "event", type: "WebSocketClosedEvent", guildId: this.guildID, code: newState.closeCode, reason: "Disconnected.", byRemote: true }, clientID: this.clientID });
                        this.destroy();
                    }
                } else {
                    if (newState.reason === VoiceConnectionDisconnectReason.WebSocketClose) //parentPort.postMessage({ op: Constants.workerOPCodes.MESSAGE, data: { op: "event", type: "WebSocketClosedEvent", guildId: this.guildID, code: newState.closeCode, reason: codeReasons[newState.closeCode], byRemote: true }, clientID: this.clientID });
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

   

    public async createStream(track: tracks): Promise<AudioResource<tracks> | undefined> {
        switch (track.sourceName) {
            case 'youtube': {
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
                    process
                        .once('spawn', () => {
                            demuxProbe(stream)
                                .then((probe) => resolve(createAudioResource(probe.stream, { metadata: track, inputType: probe.type })))
                                .catch(onError);
                        })
                        .catch(onError);
                });
            }
        }
    }


    public async play(track: tracks) {
        const stream = await this.createStream(track);
        this._applyPlayerEvents(this.audioPlayer);
        this.audioPlayer.play(stream as AudioResource<tracks>)
    }

    public _applyPlayerEvents(player: AudioPlayer) {
        player.on("stateChange", async (oldState, newState) => {
            if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
                // If the Idle state is entered from a non-Idle state, it means that an audio resource has finished playing.
				// The queue is then processed to start playing the next track, if one is available.
                
            } else if (newState.status === AudioPlayerStatus.Playing) {
				// If the Playing state has been entered, then a new track has started playback.
				
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