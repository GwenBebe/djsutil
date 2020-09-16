import color from 'tinycolor2';
import { GuildMember, Guild, TextChannel, NewsChannel, GuildChannel, Role, VoiceChannel, CategoryChannel, User, Collection } from 'discord.js';
import timestring from 'timestring';
import { ParseTypes } from '../interfaces/index';

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
    static number(str: string) {
        const number = str.match(/\d+/);

        return number ? parseInt(number[0]) : null;
    }

    /**
     * Returns a parsed HEX color string.
     *
     * @param {string} str
     * @returns {(Promise<string | void>)}
     * @memberof Parse
     */
    static color(str: string) {
        const colorData = color(str);

        return colorData.isValid() ? colorData.toHexString() : null;
    }

    /**
     * Returns a parsed URL string.
     *
     * @param {string} str
     * @returns {(Promise<string | void>)}
     * @memberof Parse
     */
    static url(str: string) {
        const url = linkRegex.exec(str);

        return url?.[0] || null;
    }

    /**
     * Returns a parsed boolean.
     *
     * @param {string} str
     * @returns {(Promise<string | void>)}
     * @memberof Parse
     */
    static boolean(str: string) {
        const bool = str.match(/(true|false)/gi);

        return bool ? bool[0] === 'true' : null;
    }

    /**
     * Returns a parsed snowflake ID.
     *
     * @param {string} str
     * @returns {(Promise<string | void>)}
     * @memberof Parse
     */
    static snowflake(str: string) {
        const snowflake = str.match(/\d{17,19}/gi);

        return snowflake?.[0] || null;
    }

    /**
     * Returns a parsed timelength in milliseconds.
     *
     * @param {string} str
     * @returns {(Promise<number | void>)}
     * @memberof Parse
     */
    static timeLength(str: string) {
        try {
            const time = timestring(str, 'ms');
            return time;
        } catch (err) {
            return null;
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
    static member(guild: Guild, str: string) {
        return guild.members.cache.filter(memberFilterInexact(str));
    }

    /**
     * Returns banned user.
     *
     * @param {Guild} guild
     * @param {string} str
     * @returns {( Promise<Collection<string, { user: User; reason: string }> | void>>)}
     * @memberof Parse
     */
    static async bannedUser(guild: Guild, str: string) {
        const bans = await guild.fetchBans();

        return bans.filter(bannedMemberFilterInexact(str));
    }

    /**
     * Returns guild role.
     *
     * @param {Guild} guild
     * @param {string} str
     * @returns {(Promise<Role | void>)}
     * @memberof Parse
     */
    static role(guild: Guild, str: string) {
        return guild.roles.cache.filter(roleFilterInexact(str));
    }

    /**
     * Returns guildChannel
     *
     * @param {Guild} guild
     * @param {string} str
     * @returns {(Promise<GuildChannel | void>)}
     * @memberof Parse
     */
    static guildChannel(guild: Guild, str: string) {
        return guild.channels.cache.filter(channelFilterInexact(str));
    }

    /**
     * Returns voice channel.
     *
     * @param {Guild} guild
     * @param {string} str
     * @returns {(Promise<VoiceChannel | void>)}
     * @memberof Parse
     */
    static voiceChannel(guild: Guild, str: string) {
        return guild.channels.cache.filter(c => c instanceof VoiceChannel && channelFilterInexact(str)(c)) as Collection<string, VoiceChannel>;
    }

    /**
     * Returns category channel.
     *
     * @param {Guild} guild
     * @param {string} str
     * @returns {(Promise<CategoryChannel | void>)}
     * @memberof Parse
     */
    static categoryChannel(guild: Guild, str: string) {
        return guild.channels.cache.filter(c => c instanceof CategoryChannel && channelFilterInexact(str)(c)) as Collection<string, CategoryChannel>;
    }

    /**
     * Returns text channel.
     *
     * @param {Guild} guild
     * @param {string} str
     * @returns {(Promise<TextChannel | NewsChannel | void>)}
     * @memberof Parse
     */
    static textChannel(guild: Guild, str: string) {
        return guild.channels.cache.filter(c => (c instanceof TextChannel || c instanceof NewsChannel) && channelFilterInexact(str)(c)) as Collection<
            string,
            TextChannel | NewsChannel
        >;
    }
}

export function parseType<K extends keyof ParseTypes>(type: K, str: string, guild?: Guild): ParseTypes[K];

export function parseType(type: keyof ParseTypes, str: string, guild?: Guild) {
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
            if (!guild) throw new Error(`Attempted to get Member without providing a Guild`);

            return Parse.member(guild, str);
        case 'bannedUser':
            if (!guild) throw new Error(`Attempted to get Member without providing a Guild`);

            return Parse.bannedUser(guild, str);
        case 'role':
            if (!guild) throw new Error(`Attempted to get Banned User without providing a Guild`);

            return Parse.role(guild, str);
        case 'textChannel':
            if (!guild) throw new Error(`Attempted to get Role without providing a Guild`);

            return Parse.textChannel(guild, str);
        case 'voiceChannel':
            if (!guild) throw new Error(`Attempted to get Text Channel without providing a Guild`);

            return Parse.voiceChannel(guild, str);
        case 'guildChannel':
            if (!guild) throw new Error(`Attempted to get Voice Channel without providing a Guild`);

            return Parse.guildChannel(guild, str);
        case 'boolean':
            return Parse.boolean(str);
        case 'snowflake':
            return Parse.snowflake(str);
        case 'timeLength':
            return Parse.timeLength(str);
        default:
            return null;
    }
}
