import { Request, Response, NextFunction } from "express";

export default async function loggerMiddleware(request: Request, response: Response, next: NextFunction): Promise<void> {
    const d = new Date();
    console.log(`${d.getHours()}:${d.getMinutes()}:${d.getSeconds()} - ${request.method} - ${request.path}`);
    next();
}
