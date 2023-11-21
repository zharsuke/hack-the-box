"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect("/auth/login");
    }
    next();
};
