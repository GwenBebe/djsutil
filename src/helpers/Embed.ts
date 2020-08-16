import { MessageEmbed } from 'discord.js';
import { Client } from '../client/Client';

export class Embed {
    client: Client;
    constructor(client: Client) {
        this.client = client;
    }

    new(type: 'BASIC' | 'INFO' | 'SUCCESS' | 'ERROR' = 'BASIC', timestamp = false) {
        if (!['BASIC', 'INFO', 'SUCCESS', 'ERROR'].includes(type)) throw new Error(`Invalid Embed Type '${type}'`);

        const embed = new MessageEmbed().setColor(
            type === 'INFO'
                ? this.client.colors.info
                : type === 'ERROR'
                ? this.client.colors.error
                : type === 'SUCCESS'
                ? this.client.colors.success
                : this.client.colors.basic
        );
        if (timestamp) embed.setTimestamp();

        return embed;
    }
}
