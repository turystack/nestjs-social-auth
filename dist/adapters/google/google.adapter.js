import { createRemoteJWKSet, jwtVerify } from 'jose';
import { SocialAuthUnauthorizedException } from '../../exceptions/social-auth-unauthorized.exception.js';
const GOOGLE_JWKS_URI = 'https://www.googleapis.com/oauth2/v3/certs';
const GOOGLE_ISSUER = 'https://accounts.google.com';
export class GoogleAdapter {
    clientId;
    jwks = createRemoteJWKSet(new URL(GOOGLE_JWKS_URI));
    constructor(clientId) {
        this.clientId = clientId;
    }
    async resolveIdentity(token) {
        try {
            const { payload } = await jwtVerify(token, this.jwks, {
                audience: this.clientId,
                issuer: GOOGLE_ISSUER,
            });
            return {
                avatar: payload.picture ?? null,
                email: payload.email ?? null,
                id: payload.sub,
                name: payload.name ?? null,
            };
        }
        catch {
            throw new SocialAuthUnauthorizedException();
        }
    }
}
//# sourceMappingURL=google.adapter.js.map