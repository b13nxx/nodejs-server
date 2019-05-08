"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const mysql = require("mysql");
const dotenv_1 = require("dotenv");
const fs_1 = require("fs");
const HttpStatus_1 = require("../definition/HttpStatus");
class Server {
    constructor() {
        this.app = express();
        this.router = express.Router();
        this.connectionPool = mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'mysql',
            database: 'my_db',
            connectionLimit: 10
        });
        dotenv_1.config();
        this.setup(process.env.PORT);
    }
    listen(port) {
        this.app.listen(port, () => {
            console.log('Server running on port ' + port);
        });
    }
    setup(port) {
        this.listen(port);
        this.app.use('/api', this.router);
        this.router.get('/', (req, res) => res.sendStatus(HttpStatus_1.default.NoContent));
        this.load();
        this.router.use((req, res) => res.sendStatus(HttpStatus_1.default.NotFound));
        this.router.use((er, req, res, next) => res.sendStatus(HttpStatus_1.default.InternalServerError));
    }
    load() {
        for (let service of Server.getServices()) {
            service = require('../service/' + service).default;
            // @ts-ignore
            service = new service(this.router, this.connectionPool);
        }
    }
    static getServices() {
        let names = [];
        let info;
        for (let file of fs_1.readdirSync('./src/service')) {
            info = file.split('.');
            info.ext = info.pop();
            info.name = info.join('');
            if (info.name !== 'BaseService' && info.ext === 'js')
                names.push(info.name);
        }
        return names;
    }
}
const server = new Server();
