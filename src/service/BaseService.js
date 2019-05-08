"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const HttpStatus_1 = require("../definition/HttpStatus");
class BaseService {
    constructor(router, connectionPool) {
        this.router = express_1.Router();
        this.connectionPool = connectionPool;
        this.setup(router);
    }
    getName() {
        return this.constructor.name.toLowerCase();
    }
    setup(router) {
        router.use('/' + this.getName(), this.router);
        this.router.get('/', (req, res) => BaseService.send(res, HttpStatus_1.default.NoContent));
    }
    dynamicRequest(self) {
        let methods = BaseService.getMethods(self);
        for (let name of methods) {
            this.router.get('/' + name, (req, res, next) => {
                let params = BaseService.getParameters(name, self[name].toString());
                if (!BaseService.checkQuery(req.query, params))
                    return BaseService.send(res, HttpStatus_1.default.BadRequest);
                if (params.length > 1)
                    req.query = BaseService.orderQuery(req.query, params);
                self[name].apply(self, Object.values(req.query))
                    .then((body) => BaseService.send(res, body.status, body.response))
                    .catch(next);
            });
        }
        this.router.use((req, res, next) => {
            let breadcrumbs = req.path.substr(1).split('/');
            if (breadcrumbs[breadcrumbs.length - 1] === '')
                breadcrumbs.pop();
            return breadcrumbs.length === 1 ? BaseService.send(res, HttpStatus_1.default.NotImplemented) : next();
        });
    }
    static getMethods(self) {
        let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(self));
        methods.shift();
        return methods;
    }
    static getParameters(name, methodString) {
        let pattern = new RegExp(name + '\\s*\\((.*)\\)');
        let params = [];
        if (methodString.match(pattern)[1].split(',')[0].length) {
            params = methodString.match(pattern)[1].split(',');
            for (let i = 0; i < params.length; i++)
                params[i] = params[i].trim();
        }
        return params;
    }
    static checkQuery(query, args) {
        if (Object.keys(query).length !== args.length)
            return false;
        for (let arg of args)
            if (!(arg in query))
                return false;
        return true;
    }
    static orderQuery(query, order) {
        let newQuery = {};
        for (let name of order)
            newQuery[name] = query[name];
        return newQuery;
    }
    static send(res, status, response = {}) {
        status === HttpStatus_1.default.OK || status === HttpStatus_1.default.Created || status === HttpStatus_1.default.MovedPermanently ? res.status(status).json(response) : res.sendStatus(status);
    }
}
exports.default = BaseService;
