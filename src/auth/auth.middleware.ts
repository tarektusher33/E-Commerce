import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    constructor(private readonly jwtService : JwtService){}

    use(req : Request, res : Response, next : NextFunction){
        const authHeader = req.headers['authorization'];
        if(!authHeader || !authHeader.startsWith('Bearer')){
            throw new UnauthorizedException('Invalid Token');
        }
        const token = authHeader.split(' ')[1];
        try {
            const payload = this.jwtService.verify(token);
            req['user'] = payload;
            next();
        } catch (error) {
            throw new UnauthorizedException('Invalid Token');
        }
    }
}