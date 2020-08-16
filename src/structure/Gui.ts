import { User, TextChannel, DMChannel, NewsChannel, Message, Guild } from 'discord.js';
import { Client } from '../client/Client';
import { newId } from '../helpers/ID';

export class Gui {
    id: string;
    user: User;
    guild?: Guild;
    channel: TextChannel | DMChannel | NewsChannel;
    client: Client;
    gui?: Message;
    type?: 'BASIC' | 'INFO' | 'SUCCESS' | 'ERROR' = 'BASIC';

    constructor(user: User, channel: TextChannel | DMChannel | NewsChannel, client: Client, guild?: Guild, type?: 'BASIC' | 'INFO' | 'SUCCESS' | 'ERROR') {
        this.user = user;
        this.channel = channel;
        this.client = client;
        this.guild = guild;
        this.id = newId();
        this.type = type;
    }

    async init() {
        if (this.gui) return this.gui;

        this.gui = await this.channel.send(this.client.embed.new(this.type));

        return this.gui;
    }

    async delete(options?: { timeout?: number; reason?: string }) {
        this.client.guis.remove(this.id);
        return this.gui?.delete(options);
    }
}
