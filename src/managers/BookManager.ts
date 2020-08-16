import { Client } from '../client/Client';
import { Book } from '../structure/Book';
import { BaseManager } from './BaseManager';
import { User, TextChannel, DMChannel, NewsChannel, Guild, MessageReaction, PartialUser } from 'discord.js';
import { newId } from '../helpers/ID';

export class BookManager extends BaseManager<Book> {
    constructor(client: Client, data?: object) {
        super(client, data);
        this.listen();
    }

    new(
        name: string,
        items: string[],
        user: User,
        channel: TextChannel | DMChannel | NewsChannel,
        perPage = 15,
        images = false,
        type: 'BASIC' | 'INFO' | 'SUCCESS' | 'ERROR' = 'BASIC',
        guild?: Guild
    ) {
        const book = new Book(name, items, user, channel, this.client, guild, type, perPage, images);
        this.add(book, newId());
        return book;
    }

    listen() {
        this.client.on('messageReactionAdd', (reaction: MessageReaction, user: User | PartialUser) => {
            if (user.bot) return;
            const book = this.cache.find(b => b.gui?.id === reaction.message.id);
            if (!book) return;
            if (user.id !== book.user.id) return reaction.users.remove(user.id).catch(() => null);
            reaction.users.remove(user.id).catch(() => null);
            switch (reaction.emoji.name) {
                case '⏮️':
                    return book.firstPage();
                case '◀️':
                    return book.previousPage();
                case '⏹️':
                    return book.stop();
                case '▶️':
                    return book.nextPage();
                case '⏭️':
                    return book.lastPage();
                case '🗑️':
                    return book.delete();
                default:
                    return;
            }
        });
    }
}
