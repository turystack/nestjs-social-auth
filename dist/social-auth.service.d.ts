import type { ISocialAuthAdapter } from './social-auth.adapter.interface.js';
import type { SocialAuthInput, SocialAuthProfile, SocialAuthProvider } from './social-auth.types.js';
export declare class SocialAuthService {
    private readonly adapters;
    constructor(adapters: Map<SocialAuthProvider, ISocialAuthAdapter>);
    resolveIdentity(input: SocialAuthInput): Promise<SocialAuthProfile>;
}
//# sourceMappingURL=social-auth.service.d.ts.map