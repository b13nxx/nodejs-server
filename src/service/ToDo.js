"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus_1 = require("../definition/HttpStatus");
const BaseService_1 = require("./BaseService");
class ToDo extends BaseService_1.default {
    constructor(router) {
        super(router);
        this.dynamicRequest(BaseService_1.default.getMethods(this));
    }
    add(title, createdBy) {
        return {
            status: HttpStatus_1.default.Created,
            response: 'New todo has been created'
        };
    }
    del(id) {
        return {
            status: HttpStatus_1.default.OK,
            response: 'You actually tried to erase me?'
        };
    }
}
exports.default = ToDo;
