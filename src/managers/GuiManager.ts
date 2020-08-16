import { Client } from '../client/Client';
import { Gui } from '../structure/Gui';
import { BaseManager } from './BaseManager';
import { Book } from '../structure/Book';
import { BookManager } from './BookManager';
import { PromptManager } from './PromptManager';

export class GuiManager extends BaseManager<Gui | Book> {
    books: BookManager;
    prompts: PromptManager;

    constructor(client: Client, data?: object) {
        super(client, data);
        this.books = new BookManager(client, data);
        this.prompts = new PromptManager(client, data);
    }
}
