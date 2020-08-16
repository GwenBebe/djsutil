import { User, TextChannel, Guild, DMChannel, NewsChannel, Message, Role, GuildChannel, VoiceChannel, GuildMember, Collection } from 'discord.js';
import { Client } from '../client/Client';
import { Gui } from './Gui';
import { ValueType, parseType } from '../helpers/Parse';

export class Prompt extends Gui {
    constructor(
        user: User,
        channel: TextChannel | DMChannel | NewsChannel,
        client: Client,
        guild?: Guild,
        type: 'BASIC' | 'INFO' | 'SUCCESS' | 'ERROR' = 'BASIC'
    ) {
        super(user, channel, client, guild, type);
    }

    async question(
        title: string,
        description: string,
        options?: { type?: ValueType; optional?: boolean; timeout?: number; retry?: boolean; lastResponse?: string }
    ): Promise<{
        canceled?: boolean;
        none?: boolean;
        response?: Role | TextChannel | GuildChannel | VoiceChannel | { user: User; reason: string } | string | GuildMember | User | boolean | number;
    } | void> {
        const gui = this.gui || (await this.init());

        if (!options) options = { type: 'string', timeout: 60000 };
        if (!options.type) options.type = 'string';
        if (!options.timeout) options.timeout = 60000;

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

        if (!response) return;

        if (options.optional && response.content === 'none') return { none: true };

        const parsed = await parseType(options.type, response.content);

        if (parsed instanceof Collection) {
            const first = parsed.first();
            if (parsed.size === 1 && first) return { response: parsed.first() };
            else if (parsed.size > 1) return;
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
    }
}
