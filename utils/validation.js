"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEmail = exports.isRange = exports.isLength = exports.isAlphaWhite = exports.isAlpha = void 0;
const isAlpha = function (value) {
    let str = value;
    return /^[A-Z]+$/i.test(str);
};
exports.isAlpha = isAlpha;
const isAlphaWhite = function (value) {
    value = value.trim();
    return /^[A-Z\s]+$/i.test(value);
};
exports.isAlphaWhite = isAlphaWhite;
const isLength = function (value, min, max) {
    if (value === undefined)
        return false;
    if (min && value.length < min)
        return false;
    if (max && value.length > max)
        return false;
    return true;
};
exports.isLength = isLength;
const isRange = function (value, min, max) {
    return value >= min && value <= max;
};
exports.isRange = isRange;
const isEmail = function (value) {
    let str = value;
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/i.test(str);
};
exports.isEmail = isEmail;
//# sourceMappingURL=validation.js.map