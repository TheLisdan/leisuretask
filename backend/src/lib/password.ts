import { type Express } from 'express';
import { Passport } from 'passport';
import { ExtractJwt, Strategy as JWTstrategy } from 'passport-jwt';
import { type AppContext } from './ctx';

export const applyPasswordToExpressApp = (
  expressApp: Express,
  ctx: AppContext
): void => {
  const passport = new Passport();

  passport.use(
    new JWTstrategy(
      {
        secretOrKey: 'not-really-secret-jwt-key',
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
      },
      (jwtPayload: string, done) => {
        ctx.prisma.user
          .findUnique({ where: { id: jwtPayload } })
          .then((user) => {
            if (!user) {
              done(null, false);
              return;
            }
            done(null, user);
          })
          .catch((error) => {
            done(error, false);
          });
      }
    )
  );

  expressApp.use((req, res, next) => {
    if (!req.headers.authorization) {
      next();
      return;
    }
    passport.authenticate('jwt', { session: false })(req, res, next);
  });
};
