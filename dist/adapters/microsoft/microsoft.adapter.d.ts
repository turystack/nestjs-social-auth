import type { ISocialAuthAdapter } from '../../social-auth.adapter.interface.js';
import type { SocialAuthProfile } from '../../social-auth.types.js';
export declare class MicrosoftAdapter implements ISocialAuthAdapter {
    private readonly jwks;
    constructor(tenantId?: string);
    resolveIdentity(token: string): Promise<SocialAuthProfile>;
}
//# sourceMappingURL=microsoft.adapter.d.ts.map