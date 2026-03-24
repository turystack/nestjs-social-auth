import type { ISocialAuthAdapter } from '../../social-auth.adapter.interface.js';
import type { SocialAuthProfile } from '../../social-auth.types.js';
export declare class FacebookAdapter implements ISocialAuthAdapter {
    resolveIdentity(token: string): Promise<SocialAuthProfile>;
}
//# sourceMappingURL=facebook.adapter.d.ts.map