import type { ISocialAuthAdapter } from '../../social-auth.adapter.interface.js';
import type { SocialAuthProfile } from '../../social-auth.types.js';
export declare class AppleAdapter implements ISocialAuthAdapter {
    private readonly clientId;
    private readonly jwks;
    constructor(clientId: string);
    resolveIdentity(token: string): Promise<SocialAuthProfile>;
}
//# sourceMappingURL=apple.adapter.d.ts.map