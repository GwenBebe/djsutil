import color from 'tinycolor2';
import { GuildMember, Guild, TextChannel, NewsChannel, GuildChannel, Role, VoiceChannel, CategoryChannel, User, Collection } from 'discord.js';
import timestring from 'timestring';

const linkRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

export const memberFilterInexact = (search: string) => (mem: GuildMember) =>
    mem.user.username.toLowerCase().includes(search.toLowerCase()) ||
    (mem.nickname && mem.nickname.toLowerCase().includes(search.toLowerCase())) ||
    `${mem.user.username.toLowerCase()}#${mem.user.discriminator}`.includes(search.toLowerCase()) ||
    search.includes(mem.user.id);

export const channelFilterInexact = (search: string) => (chan: GuildChannel) =>
    chan.name.toLowerCase().includes(search.toLowerCase()) || search.toLowerCase().includes(chan.id);

export const roleFilterInexact = (search: string) => (role: Role) =>
    search.toLowerCase().includes(role.id) ||
    role.name.toLowerCase().includes(search.toLowerCase()) ||
    role.toString().toLowerCase().includes(search.toLowerCase());

interface Ban {
    reason: string;
    user: User;
}

export const bannedMemberFilterInexact = (search: string) => (ban: Ban) =>
    ban.user.username.toLowerCase().includes(search.toLowerCase()) ||
    ban.user.tag.toLowerCase().includes(search.toLowerCase()) ||
    search.toLowerCase().includes(ban.user.id);

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

export async function parseType(type: 'number', str: string): Promise<number | void>;

export async function parseType(type: 'color', str: string): Promise<string | void>;

export async function parseType(type: 'string', str: string): Promise<string | void>;

export async function parseType(type: 'url', str: string): Promise<string | void>;

export async function parseType(type: 'guildMember', str: string, guild: Guild): Promise<Collection<string, GuildMember>>;

export async function parseType(type: 'bannedUser', str: string, guild: Guild): Promise<Collection<string, { user: User; reason: string }> | void>;

export async function parseType(type: 'role', str: string, guild: Guild): Promise<Collection<string, Role> | void>;

export async function parseType(type: 'textChannel', str: string, guild: Guild): Promise<Collection<string, TextChannel | NewsChannel> | void>;

export async function parseType(type: 'voiceChannel', str: string, guild: Guild): Promise<Collection<string, VoiceChannel> | void>;

export async function parseType(type: 'guildChannel', str: string, guild: Guild): Promise<Collection<string, GuildChannel> | void>;

export async function parseType(type: 'boolean', str: string): Promise<boolean | void>;

export async function parseType(type: 'snowflake', str: string): Promise<string | void>;

export async function parseType(type: 'timeLength', str: string): Promise<number | void>;

export async function parseType(
    type: ValueType,
    str: string,
    guild?: Guild
): Promise<
    | number
    | string
    | Collection<string, GuildMember>
    | Collection<string, Role>
    | Collection<string, VoiceChannel>
    | Collection<string, GuildChannel>
    | Collection<string, TextChannel | NewsChannel>
    | boolean
    | Collection<string, { user: User; reason: string }>
    | void
>;

export async function parseType(
    type: ValueType,
    str: string,
    guild?: Guild
): Promise<
    | number
    | string
    | Collection<string, GuildMember>
    | Collection<string, Role>
    | Collection<string, VoiceChannel>
    | Collection<string, GuildChannel>
    | Collection<string, TextChannel | NewsChannel>
    | boolean
    | Collection<string, { user: User; reason: string }>
    | void
> {
    switch (type) {
        case 'number':
            return Parse.number(str);
        case 'color':
            return Parse.color(str);
        case 'string':
            return str;
        case 'url':
            return Parse.url(str);
        case 'guildMember':
            if (!guild) throw new Error(`Attempted To Get Member In DMS`);

            return Parse.member(guild, str);
        case 'bannedUser':
            if (!guild) throw new Error(`Attempted To Get Member In DMS`);

            return Parse.bannedUser(guild, str);
        case 'role':
            if (!guild) throw new Error(`Attempted To Get Banned User In DMS`);

            return Parse.role(guild, str);
        case 'textChannel':
            if (!guild) throw new Error(`Attempted To Get Role In DMS`);

            return Parse.textChannel(guild, str);
        case 'voiceChannel':
            if (!guild) throw new Error(`Attempted To Get Text Channel In DMS`);

            return Parse.voiceChannel(guild, str);
        case 'guildChannel':
            if (!guild) throw new Error(`Attempted To Get Voice Channel In DMS`);

            return Parse.guildChannel(guild, str);
        case 'boolean':
            return Parse.boolean(str);
        case 'snowflake':
            return Parse.snowflake(str);
        case 'timeLength':
            return Parse.timeLength(str);
        default:
            return;
    }
}
/**
 * Used to parse strings into various values.
 *
 * @export
 * @class Parse
 */
export class Parse {
    /**
     * Returns a parsed integer.
     *
     * @param {string} str
     * @returns {(Promise<number | void>)}
     * @memberof Parse
     */
    static async number(str: string): Promise<number | void> {
        const number = str.match(/\d+/);

        if (!number) return;

        return parseInt(number[0]);
    }

    /**
     * Returns a parsed HEX color string.
     *
     * @param {string} str
     * @returns {(Promise<string | void>)}
     * @memberof Parse
     */
    static async color(str: string): Promise<string | void> {
        const colorData = color(str);

        if (!colorData.isValid()) return;

        return colorData.toHexString();
    }

    /**
     * Returns a parsed URL string.
     *
     * @param {string} str
     * @returns {(Promise<string | void>)}
     * @memberof Parse
     */
    static async url(str: string): Promise<string | void> {
        const url = str.match(linkRegex);

        if (!url) return;

        return url[0];
    }

    /**
     * Returns a parsed boolean.
     *
     * @param {string} str
     * @returns {(Promise<string | void>)}
     * @memberof Parse
     */
    static async boolean(str: string): Promise<boolean | void> {
        const bool = str.match(/(true|false)/gi);

        if (!bool) return;

        return bool[0] === 'true';
    }

    /**
     * Returns a parsed snowflake ID.
     *
     * @param {string} str
     * @returns {(Promise<string | void>)}
     * @memberof Parse
     */
    static async snowflake(str: string): Promise<string | void> {
        const snowflake = str.match(/\d{17,19}/gi);

        if (!snowflake) return;

        return snowflake[0];
    }

    /**
     * Returns a parsed timelength in milliseconds.
     *
     * @param {string} str
     * @returns {(Promise<number | void>)}
     * @memberof Parse
     */
    static async timeLength(str: string): Promise<number | void> {
        try {
            const time = timestring(str, 'ms');
            return time;
        } catch (err) {
            return;
        }
    }

    /**
     * Returns guild member.
     *
     * @param {Guild} guild
     * @param {string} str
     * @returns {(Promise<GuildMember | void>)}
     * @memberof Parse
     */
    static async member(guild: Guild, str: string): Promise<Collection<string, GuildMember>> {
        const members = guild.members.cache;

        const result = members.filter(memberFilterInexact(str));

        return result;
    }

    /**
     * Returns banned user.
     *
     * @param {Guild} guild
     * @param {string} str
     * @returns {( Promise<Collection<string, { user: User; reason: string }> | void>>)}
     * @memberof Parse
     */
    static async bannedUser(guild: Guild, str: string): Promise<Collection<string, { user: User; reason: string }>> {
        const bans = await guild.fetchBans();

        const result = bans.filter(bannedMemberFilterInexact(str));

        return result;
    }

    /**
     * Returns guild role.
     *
     * @param {Guild} guild
     * @param {string} str
     * @returns {(Promise<Role | void>)}
     * @memberof Parse
     */
    static async role(guild: Guild, str: string): Promise<Collection<string, Role>> {
        const roles = guild.roles.cache;

        const result = roles.filter(roleFilterInexact(str));

        return result;
    }

    /**
     * Returns guildChannel
     *
     * @param {Guild} guild
     * @param {string} str
     * @returns {(Promise<GuildChannel | void>)}
     * @memberof Parse
     */
    static async guildChannel(guild: Guild, str: string): Promise<Collection<string, GuildChannel>> {
        const channels = guild.channels.cache;

        const result = channels.filter(channelFilterInexact(str));

        return result;
    }

    /**
     * Returns voice channel.
     *
     * @param {Guild} guild
     * @param {string} str
     * @returns {(Promise<VoiceChannel | void>)}
     * @memberof Parse
     */
    static async voiceChannel(guild: Guild, str: string): Promise<Collection<string, VoiceChannel>> {
        const channels = guild.channels.cache;

        const result = channels.filter(channelFilterInexact(str));

        const chans: Collection<string, VoiceChannel> = new Collection();

        result.forEach(c => (c instanceof VoiceChannel ? chans.set(c.id, c) : null));

        return chans;
    }

    /**
     * Returns category channel.
     *
     * @param {Guild} guild
     * @param {string} str
     * @returns {(Promise<CategoryChannel | void>)}
     * @memberof Parse
     */
    static async categoryChannel(guild: Guild, str: string): Promise<Collection<string, CategoryChannel>> {
        const channels = guild.channels.cache;

        const result = channels.filter(channelFilterInexact(str));

        const chans: Collection<string, CategoryChannel> = new Collection();

        result.forEach(c => (c instanceof CategoryChannel ? chans.set(c.id, c) : null));

        return chans;
    }

    /**
     * Returns text channel.
     *
     * @param {Guild} guild
     * @param {string} str
     * @returns {(Promise<TextChannel | NewsChannel | void>)}
     * @memberof Parse
     */
    static async textChannel(guild: Guild, str: string): Promise<Collection<string, TextChannel | NewsChannel>> {
        const channels = guild.channels.cache;

        const result = channels.filter(channelFilterInexact(str));

        const chans: Collection<string, TextChannel | NewsChannel> = new Collection();

        result.forEach(c => (c instanceof TextChannel || c instanceof NewsChannel ? chans.set(c.id, c) : null));

        return chans;
    }
}
