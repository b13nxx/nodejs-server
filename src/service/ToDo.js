"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus_1 = require("../definition/HttpStatus");
const BaseService_1 = require("./BaseService");
class ToDo extends BaseService_1.default {
    constructor(router, connectionPool) {
        super(router, connectionPool);
        this.dynamicRequest(this);
    }
    list() {
        return new Promise((resolve, reject) => {
            this.connectionPool.query('SELECT * FROM todos', (error, results, fields) => {
                if (error)
                    return reject(error);
                resolve({
                    status: HttpStatus_1.default.OK,
                    response: results
                });
            });
        });
    }
    add(title, createdBy) {
        return new Promise((resolve, reject) => {
            resolve({
                status: HttpStatus_1.default.Created,
                response: 'New todo has been created'
            });
        });
    }
    del(id) {
        return new Promise((resolve, reject) => {
            resolve({
                status: HttpStatus_1.default.OK,
                response: 'You actually tried to erase me?'
            });
        });
    }
}
exports.default = ToDo;
