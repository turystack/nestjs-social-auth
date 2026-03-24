import { createRemoteJWKSet, jwtVerify } from 'jose';
import { SocialAuthUnauthorizedException } from '../../exceptions/social-auth-unauthorized.exception.js';
export class MicrosoftAdapter {
    jwks;
    constructor(tenantId = 'common') {
        const jwksUri = `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`;
        this.jwks = createRemoteJWKSet(new URL(jwksUri));
    }
    async resolveIdentity(token) {
        try {
            const { payload } = await jwtVerify(token, this.jwks);
            const id = payload.oid ?? payload.sub;
            return {
                avatar: null,
                email: payload.preferred_username ??
                    payload.email ??
                    null,
                id,
                name: payload.name ?? null,
            };
        }
        catch {
            throw new SocialAuthUnauthorizedException();
        }
    }
}
//# sourceMappingURL=microsoft.adapter.js.map