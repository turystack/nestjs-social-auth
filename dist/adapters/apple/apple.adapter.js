import { createRemoteJWKSet, jwtVerify } from 'jose';
import { SocialAuthUnauthorizedException } from '../../exceptions/social-auth-unauthorized.exception.js';
const APPLE_JWKS_URI = 'https://appleid.apple.com/auth/keys';
const APPLE_ISSUER = 'https://appleid.apple.com';
export class AppleAdapter {
    clientId;
    jwks = createRemoteJWKSet(new URL(APPLE_JWKS_URI));
    constructor(clientId) {
        this.clientId = clientId;
    }
    async resolveIdentity(token) {
        try {
            const { payload } = await jwtVerify(token, this.jwks, {
                audience: this.clientId,
                issuer: APPLE_ISSUER,
            });
            return {
                avatar: null,
                email: payload.email ?? null,
                id: payload.sub,
                name: null,
            };
        }
        catch {
            throw new SocialAuthUnauthorizedException();
        }
    }
}
//# sourceMappingURL=apple.adapter.js.map