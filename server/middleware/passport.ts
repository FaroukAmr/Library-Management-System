import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import config from '../constants';
import db from '../database/db';
import passport from 'passport';

const cookieExtractor = function (req: Request) {
  let token = null;
  if (req && req.cookies) token = req.cookies['token'];
  return token;
};

const opts = {
  secretOrKey: config.SECRET!,
  jwtFromRequest: cookieExtractor,
};

passport.use(
  new Strategy(opts, async ({ email }, done) => {
    try {
      const { rows } = await db.query(
        'SELECT username, email FROM users WHERE email = $1',
        [email]
      );

      if (!rows.length) {
        throw new Error('401 not authorized');
      }

      let user = { username: rows[0].username, email: rows[0].email };

      return done(null, user);
    } catch (error: any) {
      console.log(error.message);
      done(null, false);
    }
  })
);
