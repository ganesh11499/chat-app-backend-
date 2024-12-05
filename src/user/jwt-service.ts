import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService{
    private readonly secret: string = '1123';
    private readonly expiry: string = '1d';

    generateToken(payload: any): string {
        return jwt.sign(payload, this.secret, {expiresIn: this.expiry});
    }

    verifyToken(token: string): any {
        try {
            return jwt.verify(token, this.secret);
        } catch (error) {
            return null;
        }
    }
}