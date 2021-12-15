export default async function loggerMiddleware(req, res, next) {
    const d = new Date();
    const hour = d.getHours().toString().padStart(2, "0");
    const minute = d.getMinutes().toString().padStart(2, "0");
    const secound = d.getSeconds().toString().padStart(2, "0");
    console.log(`${hour}:${minute}:${secound} - ${req.method} - ${req.path}`);
    next();
}
//# sourceMappingURL=logger.middleware.js.map