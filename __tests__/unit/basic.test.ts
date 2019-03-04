import * as express from 'express';
import { agent, Response, SuperTest, Test } from 'supertest';
const eboom = require('../../src/index');

const message = "Test message";
const data = { id: 1 };
const app: express.Application = express();
app.use(eboom());
app.use('/bad-data', (req: express.Request, res: any) => {
    return res.boom.badData();
});
app.use('/internal', (req: express.Request, res: any) => {
    return res.boom.internal();
});
app.use('/bad-request', (req: express.Request, res: any) => {
    return res.boom.badRequest();
});
app.use('/message', (req: express.Request, res: any) => {
    return res.boom.badRequest(message);
});
app.use('/data', (req: express.Request, res: any) => {
    return res.boom.badRequest(message, data);
});

const request: SuperTest<Test> = agent(app);

describe('Test basic errors', () => {
    it('should respond with status 422 if request route /bad-data', async () => {
        const response: Response = await request.get('/bad-data');
        expect(response.status).toBe(422);
    });

    it('should respond with status 500 if request route /internal', async () => {
        const response: Response = await request.get('/internal');
        expect(response.status).toBe(500);
    });

    it('should respond with status 400 if request route /bad-request', async () => {
        const response: Response = await request.get('/bad-request');
        expect(response.status).toBe(400);
    });

    it('response should contains given message for route /message', async () => {
        const response: Response = await request.get('/message');
        expect(response.body.message).toEqual(message);
    });

    it('response should contains data object for route /data', async () => {
        const response: Response = await request.get('/data');
        expect(response.body).toHaveProperty('data');
    });

    it('response should contains data with same properties as given object for route /data', async () => {
        const response: Response = await request.get('/data');
        expect(response.body.data).toEqual(data);
    });
});
