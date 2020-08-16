import { Client } from '../client/Client';
import { BaseManager } from './BaseManager';
import { Prompt } from '../structure/Prompt';
import { User, TextChannel, DMChannel, NewsChannel, Guild } from 'discord.js';
import { newId } from '../helpers/ID';

export class PromptManager extends BaseManager<Prompt> {
    constructor(client: Client, data?: object) {
        super(client, data);
    }

    new(user: User, channel: TextChannel | DMChannel | NewsChannel, type: 'BASIC' | 'INFO' | 'SUCCESS' | 'ERROR' = 'BASIC', guild?: Guild) {
        const book = new Prompt(user, channel, this.client, guild, type);
        this.add(book, newId());
        return book;
    }
}
