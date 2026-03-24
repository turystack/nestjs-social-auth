export * from '@/social-auth.module.js'
export * from '@/social-auth.service.js'
export type {
	SocialAuthModuleOptions,
	SocialAuthProfile,
	SocialAuthProvider,
} from '@/social-auth.types.js'

export { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'
