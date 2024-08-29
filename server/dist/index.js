"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("@trpc/server/adapters/express");
const ws_1 = require("@trpc/server/adapters/ws");
const routers_1 = require("./routers");
const context_1 = require("./context");
const ws_2 = __importDefault(require("ws"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
}));
app.use("/trpc", (0, express_2.createExpressMiddleware)({
    router: routers_1.appRouter,
    createContext: context_1.createContext,
}));
const server = app.listen(3000);
(0, ws_1.applyWSSHandler)({
    wss: new ws_2.default.Server({ server }),
    router: routers_1.appRouter,
    createContext: () => {
        return { isAdmin: true };
    },
});
