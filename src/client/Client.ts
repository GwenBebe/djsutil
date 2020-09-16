import { Client as BaseClient } from 'discord.js';
import { Colors, ClientOptions } from '../interfaces';
import { Embed } from '../helpers/Embed';
import { GuiManager } from '../managers/GuiManager';

export class Client extends BaseClient {
    colors: Colors = {
        BASIC: '#2f3136',
        INFO: '#8AEDFF',
        ERROR: '#DB6260',
        SUCCESS: '#75F1BD'
    };
    lang = {
        emojis: {
            first: '⏮️',
            previous: '◀️',
            stop: '⏹️',
            next: '▶️',
            last: '⏭️',
            delete: '🗑️'
        }
    };
    embed: Embed;
    guis: GuiManager;

    constructor(options?: ClientOptions) {
        super(options);

        if (options?.colors)
            this.colors = {
                ...this.colors,
                ...options.colors
            };

        if (options?.lang?.emojis)
            this.lang = {
                ...this.lang,
                ...options.lang.emojis
            };

        this.embed = new Embed(this);
        this.guis = new GuiManager(this);
    }
}
