import { Request, Response, NextFunction } from "express";

export default async function loggerMiddleware(request: Request, response: Response, next: NextFunction): Promise<void> {
    const d = new Date();
    const hour: string = d.getHours().toString().padStart(2, "0");
    const minute: string = d.getMinutes().toString().padStart(2, "0");
    const secound: string = d.getSeconds().toString().padStart(2, "0");
    console.log(`${hour}:${minute}:${secound} - ${request.method} - ${request.path}`);
    next();
}
