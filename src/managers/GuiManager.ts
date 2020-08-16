import { Client } from '../client/Client';
import { Gui } from '../structure/Gui';
import { BaseManager } from './BaseManager';
import { Book } from '../structure/Book';
import { BookManager } from './BookManager';
import { PromptManager } from './PromptManager';

/**
 * Manages GUI embeds, including paginators and prompts.
 *
 * @export
 * @class GuiManager
 * @extends {(BaseManager<Gui | Book>)}
 */
export class GuiManager extends BaseManager<Gui | Book> {
    books: BookManager;
    prompts: PromptManager;

    /**
     *Creates an instance of GuiManager.
     * @param {Client} client
     * @param {object} [data]
     * @memberof GuiManager
     */
    constructor(client: Client, data?: object) {
        super(client, data);
        this.books = new BookManager(client, data);
        this.prompts = new PromptManager(client, data);
    }
}
