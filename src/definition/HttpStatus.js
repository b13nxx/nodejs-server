"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["Created"] = 201] = "Created";
    HttpStatus[HttpStatus["NoContent"] = 204] = "NoContent";
    HttpStatus[HttpStatus["MovedPermanently"] = 301] = "MovedPermanently";
    HttpStatus[HttpStatus["BadRequest"] = 400] = "BadRequest";
    HttpStatus[HttpStatus["Unauthorized"] = 401] = "Unauthorized";
    HttpStatus[HttpStatus["Forbidden"] = 403] = "Forbidden";
    HttpStatus[HttpStatus["NotFound"] = 404] = "NotFound";
    HttpStatus[HttpStatus["InternalServerError"] = 500] = "InternalServerError";
    HttpStatus[HttpStatus["NotImplemented"] = 501] = "NotImplemented";
})(HttpStatus || (HttpStatus = {}));
exports.default = HttpStatus;
