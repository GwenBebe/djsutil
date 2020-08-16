import { Client } from '../client/Client';
import { BaseManager } from './BaseManager';
import { Prompt } from '../structure/Prompt';
import { User, TextChannel, DMChannel, NewsChannel, Guild } from 'discord.js';
import { newId } from '../helpers/ID';

/**
 * Manages prompt embeds.
 *
 * @export
 * @class PromptManager
 * @extends {BaseManager<Prompt>}
 */
export class PromptManager extends BaseManager<Prompt> {
    /**
     *Creates an instance of PromptManager.
     * @param {Client} client
     * @param {object} [data]
     * @memberof PromptManager
     */
    constructor(client: Client, data?: object) {
        super(client, data);
    }

    /**
     * Creates a new user prompt.
     *
     * @param {User} user
     * @param {(TextChannel | DMChannel | NewsChannel)} channel
     * @param {('BASIC' | 'INFO' | 'SUCCESS' | 'ERROR')} [type='BASIC']
     * @param {Guild} [guild]
     * @returns
     * @memberof PromptManager
     */
    new(user: User, channel: TextChannel | DMChannel | NewsChannel, type: 'BASIC' | 'INFO' | 'SUCCESS' | 'ERROR' = 'BASIC', guild?: Guild) {
        const book = new Prompt(user, channel, this.client, guild, type);
        this.add(book, newId());
        return book;
    }
}
