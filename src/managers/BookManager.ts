import { Client } from '../client/Client';
import { Book } from '../structure/Book';
import { BaseManager } from './BaseManager';
import { User, TextChannel, DMChannel, NewsChannel, Guild, MessageReaction, PartialUser } from 'discord.js';
import { newId } from '../helpers/ID';

/**
 * Manages paginator GUIs
 *
 * @export
 * @class BookManager
 * @extends {BaseManager<Book>}
 */
export class BookManager extends BaseManager<Book> {
    /**
     *Creates an instance of BookManager.
     * @param {Client} client
     * @param {object} [data]
     * @memberof BookManager
     */
    constructor(client: Client, data?: object) {
        super(client, data);
        this.listen();
    }

    /**
     * Creates a new book and adds it to the BookManager's cache of books.
     *
     * @param {string} name
     * @param {string[]} items
     * @param {User} user
     * @param {(TextChannel | DMChannel | NewsChannel)} channel
     * @param {number} [perPage=15]
     * @param {boolean} [images=false]
     * @param {('BASIC' | 'INFO' | 'SUCCESS' | 'ERROR')} [type='BASIC']
     * @param {Guild} [guild]
     * @returns
     * @memberof BookManager
     */
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
            const identifier = reaction.emoji.id || reaction.emoji.name;
            switch (identifier) {
                case this.client.lang.emojis.first:
                    return book.firstPage();
                case this.client.lang.emojis.previous:
                    return book.previousPage();
                case this.client.lang.emojis.stop:
                    return book.stop();
                case this.client.lang.emojis.next:
                    return book.nextPage();
                case this.client.lang.emojis.last:
                    return book.lastPage();
                case this.client.lang.emojis.delete:
                    return book.delete();
                default:
                    return;
            }
        });
    }
}
