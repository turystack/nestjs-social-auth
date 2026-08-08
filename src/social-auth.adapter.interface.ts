import type {
	SocialAuthProfileOf,
	SocialAuthProvider,
} from '@/social-auth.types.js'

export interface ISocialAuthAdapter<
	P extends SocialAuthProvider = SocialAuthProvider,
> {
	resolveIdentity(token: string): Promise<SocialAuthProfileOf<P>>
}
