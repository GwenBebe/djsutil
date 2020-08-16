import { Gui } from './Gui';
import { User, TextChannel, DMChannel, NewsChannel, Guild } from 'discord.js';
import { Client } from '../client/Client';

export class Book extends Gui {
    name: string;
    items?: string[];
    perPage: number;
    pages: string[];
    images?: boolean;
    pageNum = 0;

    constructor(
        name: string,
        items: string[],
        user: User,
        channel: TextChannel | DMChannel | NewsChannel,
        client: Client,
        guild?: Guild,
        type: 'BASIC' | 'INFO' | 'SUCCESS' | 'ERROR' = 'BASIC',
        perPage = 15,
        images = false
    ) {
        super(user, channel, client, guild, type);
        this.name = name;
        this.images = images;
        this.items = items;
        this.perPage = perPage;

        if (perPage === 1) {
            this.pages = items;
        } else {
            const pages: string[] = [];

            let page: string[] = [];

            items.forEach((item, i) => {
                if (i % (perPage || 15) === 0 && i !== 0) {
                    pages.push(page.join('\n'));

                    page = [item];
                } else {
                    page.push(item);
                }
            });

            pages.push(page.join('\n'));

            this.pages = pages;
        }
    }

    async init() {
        const gui = await super.init();
        const embed = this.client.embed
            .new(this.type)
            .setTitle(this.name + `${this.pages.length > 1 ? ` - \`${this.pageNum + 1}\` / \`${this.pages.length}\`` : ''}`);
        if (!this.images) embed.setDescription(this.pages[this.pageNum]);
        else embed.setImage(this.pages[this.pageNum]);
        gui.edit(embed).catch(() => null);
        if (this.pages.length > 1) {
            ['⏮️', '◀️', '⏹️', '▶️', '⏭️', '🗑️'].map(e => gui.react(e));
        }
        return gui;
    }

    async stop() {
        this.client.guis.books.cache.delete(this.id);
        this.gui?.reactions.removeAll().catch(() => null);
    }

    async nextPage() {
        const gui = this.gui || (await this.init());
        if (this.pageNum + 2 > this.pages.length) return;
        this.pageNum++;
        const embed = gui.embeds[0].setTitle(this.name + `${this.pages.length > 1 ? ` - \`${this.pageNum + 1}\` / \`${this.pages.length}\`` : ''}`);

        if (this.images) embed.setImage(this.pages[this.pageNum]);
        else embed.setDescription(this.pages[this.pageNum]);
        gui.edit(embed).catch(() => null);
    }

    async previousPage() {
        const gui = this.gui || (await this.init());
        if (this.pageNum === 0) return;
        this.pageNum--;
        gui.edit(
            gui.embeds[0]
                .setDescription(this.pages[this.pageNum])
                .setTitle(this.name + `${this.pages.length > 1 ? ` - \`${this.pageNum + 1}\` / \`${this.pages.length}\`` : ''}`)
        ).catch(() => null);
    }

    async firstPage() {
        const gui = this.gui || (await this.init());
        this.pageNum = 0;
        const embed = gui.embeds[0].setTitle(this.name + `${this.pages.length > 1 ? ` - \`${this.pageNum + 1}\` / \`${this.pages.length}\`` : ''}`);

        if (this.images) embed.setImage(this.pages[this.pageNum]);
        else embed.setDescription(this.pages[this.pageNum]);
        gui.edit(embed).catch(() => null);
    }

    async lastPage() {
        const gui = this.gui || (await this.init());
        this.pageNum = this.pages.length - 1;
        const embed = gui.embeds[0].setTitle(this.name + `${this.pages.length > 1 ? ` - \`${this.pageNum + 1}\` / \`${this.pages.length}\`` : ''}`);

        if (this.images) embed.setImage(this.pages[this.pageNum]);
        else embed.setDescription(this.pages[this.pageNum]);
        gui.edit(embed).catch(() => null);
    }

    async delete(options?: { timeout?: number; reason?: string }) {
        this.client.guis.books.cache.delete(this.id);
        return this.gui?.delete(options);
    }
}
