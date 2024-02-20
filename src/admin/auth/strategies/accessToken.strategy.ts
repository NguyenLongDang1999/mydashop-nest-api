// ** NestJS Imports
import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'

// ** Passport Imports
import { ExtractJwt, Strategy } from 'passport-jwt'

type JwtPayload = {
    sub: string
    email: string
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt-admin') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET
        })
    }

    validate(payload: JwtPayload) {
        return payload
    }
}
