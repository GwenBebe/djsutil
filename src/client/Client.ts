import { Client as BaseClient, ClientOptions as BaseClientOptions } from 'discord.js';
import { Embed } from '../helpers/Embed';
import { GuiManager } from '../managers/GuiManager';

interface ClientOptions extends BaseClientOptions {
    colors?: {
        basic?: string;
        info?: string;
        error?: string;
        success?: string;
    };
    lang?: {
        emojis?: {
            first?: string;
            previous?: string;
            stop?: string;
            next?: string;
            last?: string;
            delete?: string;
        };
    };
}

export class Client extends BaseClient {
    colors: {
        basic: string;
        info: string;
        error: string;
        success: string;
    };
    lang: {
        emojis: {
            first: string;
            previous: string;
            stop: string;
            next: string;
            last: string;
            delete: string;
        };
    };
    embed: Embed;
    guis: GuiManager;
    constructor(options?: ClientOptions) {
        super(options);
        this.colors = {
            basic: options?.colors?.basic || '#2f3136',
            info: options?.colors?.success || '#8AEDFF',
            error: options?.colors?.error || '#DB6260',
            success: options?.colors?.success || '#75F1BD'
        };
        this.lang = {
            emojis: {
                first: options?.lang?.emojis?.first || '⏮️',
                previous: options?.lang?.emojis?.previous || '◀️',
                stop: options?.lang?.emojis?.stop || '⏹️',
                next: options?.lang?.emojis?.next || '▶️',
                last: options?.lang?.emojis?.last || '⏭️',
                delete: options?.lang?.emojis?.delete || '🗑️'
            }
        };
        this.embed = new Embed(this);
        this.guis = new GuiManager(this);
    }
}
