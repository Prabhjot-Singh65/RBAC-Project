import jwt from 'jsonwebtoken';

export function signAccessToken({ userId, role }, secret, expiresIn='15m') {
  return jwt.sign({ sub: userId, role }, secret, { expiresIn });
}

export function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}
