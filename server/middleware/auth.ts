import passport from 'passport';

const userAuth = passport.authenticate('jwt', { session: false });

export default userAuth;
