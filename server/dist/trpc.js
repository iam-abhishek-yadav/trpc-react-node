"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminProcedure = exports.t = void 0;
const server_1 = require("@trpc/server");
exports.t = server_1.initTRPC
    .context()
    .create();
const isAdminMiddleware = exports.t.middleware(({ ctx, next }) => {
    if (!ctx.isAdmin) {
        throw new server_1.TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: { user: { id: 1 } },
    });
});
exports.adminProcedure = exports.t.procedure.use(isAdminMiddleware);
