import passport, { DoneCallback } from 'passport';
import { config } from '@/config';
import { ExtractJwt, Strategy as JwtStrategy, StrategyOptions } from 'passport-jwt';

import { JwtPayload } from 'jsonwebtoken';

if (!config.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
}

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.env.JWT_SECRET,
};

passport.use(
    new JwtStrategy(opts, async (jwt_payload: JwtPayload, done: DoneCallback) => {
        return done(null, { id: jwt_payload.sub });
    }),
);
