"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const HttpStatus_1 = require("../definition/HttpStatus");
class BaseService {
    constructor(router) {
        this.setRouter(express_1.Router());
        this.setup(router);
    }
    setRouter(router) {
        this.router = router;
    }
    getRouter() {
        return this.router;
    }
    getName() {
        return this.constructor.name.toLowerCase();
    }
    setup(router) {
        this.getRouter().get('/', (req, res) => BaseService.send(res, HttpStatus_1.default.NoContent));
        this.checkIfMethodExists();
        router.use('/' + this.getName(), this.getRouter());
    }
    dynamicRequest(methods) {
        for (let name of methods) {
            this.getRouter().get('/' + name, (req, res) => {
                let args = BaseService.getParameters(name, this[name]);
                if (!BaseService.checkQuery(req.query, args))
                    return BaseService.send(res, HttpStatus_1.default.BadRequest);
                req.query = BaseService.orderQuery(req.query, args);
                let body = this[name].apply(null, Object.values(req.query));
                BaseService.send(res, body.status, body.response);
            });
        }
        this.getRouter().use((er, req, res, next) => BaseService.send(res, HttpStatus_1.default.InternalServerError));
    }
    checkIfMethodExists() {
        this.getRouter().use((req, res, next) => {
            let breadcrumbs = req.path.substr(1).split('/');
            if (breadcrumbs[breadcrumbs.length - 1] === '')
                breadcrumbs.pop();
            if (breadcrumbs.length > 1)
                return BaseService.send(res, HttpStatus_1.default.NotFound);
            if (!BaseService.getMethods(this).includes(breadcrumbs[0]))
                return BaseService.send(res, HttpStatus_1.default.NotImplemented);
            next();
        });
    }
    static getMethods(self) {
        let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(self));
        methods.shift();
        return methods;
    }
    static getParameters(name, method) {
        let str = method.toString();
        let pattern = new RegExp(name + '\\s*\\((.*)\\)');
        let args = str.match(pattern)[1].split(',');
        for (let i = 0; i < args.length; i++)
            args[i] = args[i].trim();
        return args;
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
