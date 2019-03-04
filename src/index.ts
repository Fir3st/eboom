import * as Boom from 'Boom';

export default () => {
    return (req, res, next) => {
        if (res.boom) throw new Error('Boom already exists on response object.');

        res.boom = {};
        const methods = Object.getOwnPropertyNames(Boom).filter((prop) => {
            return typeof Boom[prop] == 'function';
        });

        for (const method of methods) {
            res.boom[method] = (message: string = "", payload: any = {}) => {
                const Boomed = Boom[method].apply(Boom, [message]);
                const BoomedWithPayload = {
                    ...Boomed.output.payload,
                    ...payload
                };

                return res.status(Boomed.output.statusCode).send(BoomedWithPayload);
            };
        }

        next();
    };
};
