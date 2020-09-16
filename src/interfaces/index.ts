import { ClientOptions as BaseClientOptions } from 'discord.js';
export type Colors = Record<'BASIC' | 'INFO' | 'ERROR' | 'SUCCESS', string>;
export type Emojis = Record<'first' | 'previous' | 'stop' | 'next' | 'last' | 'delete', string>;

export interface ClientOptions extends BaseClientOptions {
    colors?: Partial<Colors>;
    lang?: {
        emojis?: Partial<Emojis>;
    };
}
