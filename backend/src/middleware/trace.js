import { v4 as uuidv4 } from 'uuid';
import { AsyncLocalStorage } from 'async_hooks';

export const requestIdStore = new AsyncLocalStorage();

export const traceMiddleware = (req, res, next) => {
    const id = req.headers['x-correlation-id'] || uuidv4();
    res.setHeader('X-Correlation-ID', id);
    requestIdStore.run(id, () => next());
};