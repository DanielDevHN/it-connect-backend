import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract token from Authorization header
            ignoreExpiration: false, // Reject expired tokens
            secretOrKey: process.env.JWT_SECRET, // Use your secret from env or config
        });
    }

    async validate(payload: any) {
        // This method provides the JWT payload after validation
        return { userId: payload.sub, email: payload.email }; // Adjust based on your JWT payload structure
    }
}