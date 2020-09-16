const ids: Set<string> = new Set();

const createId = (): string => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 10; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};

export const newId = (): string => {
    const id = createId();
    if (ids.has(id)) return newId();
    ids.add(id);
    return id;
};
