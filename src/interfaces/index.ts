import { ClientOptions as BaseClientOptions, Collection, GuildMember, NewsChannel, TextChannel, Role, VoiceChannel, GuildChannel, User } from 'discord.js';

export type Colors = Record<'BASIC' | 'INFO' | 'ERROR' | 'SUCCESS', string>;
export type Emojis = Record<'first' | 'previous' | 'stop' | 'next' | 'last' | 'delete', string>;
export type ValueType =
    | 'role'
    | 'textChannel'
    | 'guildChannel'
    | 'voiceChannel'
    | 'string'
    | 'guildMember'
    | 'bannedUser'
    | 'boolean'
    | 'number'
    | 'color'
    | 'url'
    | 'snowflake'
    | 'timeLength';

export interface ClientOptions extends BaseClientOptions {
    colors?: Partial<Colors>;
    lang?: {
        emojis?: Partial<Emojis>;
    };
}

export interface Ban {
    reason: string;
    user: User;
}

export interface ParseTypes {
    number: number;
    boolean: boolean;
    color: string;
    string: string;
    url: string;
    snowflake: string;
    timeLength: number;
    bannedUser: Promise<Collection<string, Ban>>;
    guildMember: Collection<string, GuildMember>;
    role: Collection<string, Role>;
    textChannel: Collection<string, TextChannel | NewsChannel>;
    voiceChannel: Collection<string, VoiceChannel>;
    guildChannel: Collection<string, GuildChannel>;
}
