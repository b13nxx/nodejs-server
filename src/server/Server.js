"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const dotenv_1 = require("dotenv");
const fs_1 = require("fs");
const HttpStatus_1 = require("../definition/HttpStatus");
class Server {
    constructor() {
        this.setApp(express());
        this.setRouter(express.Router());
        dotenv_1.config();
        this.setup(process.env.PORT);
    }
    setApp(app) {
        this.app = app;
    }
    getApp() {
        return this.app;
    }
    setRouter(router) {
        this.router = router;
    }
    getRouter() {
        return this.router;
    }
    listen(port) {
        this.getApp().listen(port, () => {
            console.log('Server running on port ' + port);
        });
    }
    setup(port) {
        this.listen(port);
        this.getApp().use('/api', this.getRouter());
        this.getRouter().get('/', (req, res) => res.sendStatus(HttpStatus_1.default.NoContent));
        this.load();
        this.getRouter().use((req, res) => res.sendStatus(HttpStatus_1.default.NotFound));
    }
    load() {
        for (let service of Server.getServices()) {
            service = require('../service/' + service).default;
            // @ts-ignore
            service = new service(this.getRouter());
        }
    }
    static getServices(lowerCase = false) {
        let names = [];
        let info;
        for (let file of fs_1.readdirSync('./src/service')) {
            info = file.split('.');
            info.ext = info.pop();
            info.name = info.join('');
            if (info.name !== 'BaseService' && info.ext === 'js')
                names.push(lowerCase ? info.name.toLowerCase() : info.name);
        }
        return names;
    }
}
const server = new Server();
