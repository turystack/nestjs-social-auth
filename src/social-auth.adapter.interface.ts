import type { SocialAuthProfile } from '@/social-auth.types.js'

export interface ISocialAuthAdapter {
	resolveIdentity(token: string): Promise<SocialAuthProfile>
}
