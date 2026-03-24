import type { ISocialAuthAdapter } from '../../social-auth.adapter.interface.js';
import type { SocialAuthProfile } from '../../social-auth.types.js';
export declare class GoogleAdapter implements ISocialAuthAdapter {
    private readonly clientId;
    private readonly jwks;
    constructor(clientId: string);
    resolveIdentity(token: string): Promise<SocialAuthProfile>;
}
//# sourceMappingURL=google.adapter.d.ts.map