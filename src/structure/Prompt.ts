import { User, TextChannel, Guild, DMChannel, NewsChannel, Message, Collection } from 'discord.js';
import { Client } from '../client/Client';
import { Colors, ParseTypes } from '../interfaces';
import { Gui } from './Gui';
import { parseType } from '../helpers/Parse';
import { ValueType } from '../interfaces';

export class Prompt extends Gui {
    constructor(user: User, channel: TextChannel | DMChannel | NewsChannel, client: Client, guild?: Guild, type: keyof Colors = 'BASIC') {
        super(user, channel, client, guild, type);
    }

    async question<K extends ValueType>(
        title: string,
        description: string,
        options?: { type?: K; optional?: boolean; timeout?: number; retry?: boolean; lastResponse?: string }
    ): Promise<{
        canceled?: boolean;
        none?: boolean;
        response?: ParseTypes[K];
    } | null> {
        const gui = this.gui || (await this.init());

        if (!options) options = { type: 'string' as K, timeout: 60000 };
        if (!options.type) options.type = 'string' as K;
        if (!options.timeout) options!.timeout = 60000;

        gui.edit(
            this.client.embed
                .new(this.type)
                .setTitle(title)
                .setDescription(
                    `${
                        options.retry ? `I couldn't find the \`${options.type}\` \`${options.lastResponse}\`, please try again!\n\n` : ''
                    }${description}\n\nType \`cancel\` to cancel at any time.${options.optional ? '\n\nType `none` to leave this blank.' : ''}`
                )
        );

        const response = (
            await this.channel.awaitMessages(
                (msg: Message) => {
                    return msg.author.id === this.user.id;
                },
                { time: options.timeout, max: 1 }
            )
        ).first();

        if (!response) return null;

        if (options.optional && response.content === 'none') return { none: true };

        let parsed = null;
        parsed = (await parseType(options.type, response.content)) as ParseTypes[K];

        if (parsed instanceof Collection) {
            const first = parsed.first();
            if (parsed.size === 1 && first) return { response: first };
            else if (parsed.size > 1) return null;
            else if (parsed.size === 0) {
                options.retry = true;
                return this.question(title, description, options);
            }
        } else {
            if (!parsed) {
                options.retry = true;
                return this.question(title, description, options);
            } else return { response: parsed };
        }
        return null;
    }
}
