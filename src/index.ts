import { Request, NextFunction } from 'express';
import * as Boom from 'boom';

export = () => {
    return (req: Request, res: any, next: NextFunction) => {
        if (res.boom) throw new Error('Boom already exists on response object.');

        res.boom = {};
        const methods = Object.getOwnPropertyNames(Boom).filter((prop) => {
            return typeof Boom[prop] == 'function';
        });

        for (const method of methods) {
            res.boom[method] = (message: string = "", data: any = {}) => {
                const Boomed = Boom[method].apply(Boom, [message]);
                const BoomedWithData = { ...Boomed.output.payload };
                if (Object.keys(data).length > 0) {
                    BoomedWithData['data'] = { ... data };
                }

                return res.status(Boomed.output.statusCode).send(BoomedWithData);
            };
        }

        next();
    };
}
