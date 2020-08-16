const ids: string[] = [];

const createId = (): string => {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 10; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
};

export const newId = (): string => {
    let id = createId();
    while (ids.includes(id)) id = createId();
    return id;
};
