import * as Boom from 'Boom';

export default () => {
    return (req, res, next) => {
        if (res.boom) throw new Error('Boom already exists on response object.');

        res.boom = {};
        const methods = Object.getOwnPropertyNames(Boom).filter((prop) => {
            return typeof Boom[prop] == 'function';
        });

        methods.forEach((key) => {
            res.boom[key] = function() {
                const Boomed = Boom[key].apply(Boom, arguments);
                const BoomedWithAdditionalResponse = Object.assign(Boomed.output.payload, arguments[1]);

                return res.status(Boomed.output.statusCode).send(BoomedWithAdditionalResponse);
            };
        });

        next();
    };
};
