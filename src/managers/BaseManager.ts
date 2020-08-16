import { Client } from '../client/Client';
import { Collection } from 'discord.js';

export class BaseManager<Data> {
    client: Client;
    data?: object;
    cache: Collection<string, Data>;

    constructor(client: Client, data?: object) {
        this.client = client;
        this.data = data;
        this.cache = new Collection();
    }

    add(data: Data, id: string) {
        this.cache.set(id, data);
    }

    remove(id: string) {
        return this.cache.delete(id);
    }
}
