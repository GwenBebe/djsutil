import { MessageEmbed } from 'discord.js';
import { Client } from '../client/Client';
import { Colors } from '../interfaces';

export class Embed {
    client: Client;
    constructor(client: Client) {
        this.client = client;
    }

    new(type: keyof Colors = 'BASIC', timestamp = false) {
        if (!['BASIC', 'INFO', 'SUCCESS', 'ERROR'].includes(type)) throw new Error(`Invalid Embed Type '${type}'`);

        const embed = new MessageEmbed().setColor(this.client.colors[type]);
        if (timestamp) embed.setTimestamp();

        return embed;
    }
}
