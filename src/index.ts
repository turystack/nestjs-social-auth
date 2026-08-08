export type { ISocialAuthAdapter } from '@/social-auth.adapter.interface.js'
export * from '@/social-auth.module.js'
export * from '@/social-auth.service.js'
export type {
	SocialAuthModuleOptions,
	SocialAuthProfile,
	SocialAuthProfileMap,
	SocialAuthProfileOf,
	SocialAuthProvider,
} from '@/social-auth.types.js'

export { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'
