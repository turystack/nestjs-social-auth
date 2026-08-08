export type SocialAuthProvider = 'APPLE' | 'FACEBOOK' | 'GOOGLE' | 'MICROSOFT'

type BaseProfile = {
	/** Stable user identifier at the provider (`sub`, `oid`, or Graph `id`). */
	id: string
	/** May be absent: denied scope, phone-only account, or Apple private relay. */
	email: string | null
}

/**
 * Per-provider profile shapes. Fields a provider can never return are typed
 * `null` (not `string | null`) so consumers don't build UX on data that will
 * never exist: Apple tokens carry no name/avatar, Microsoft tokens no avatar.
 */
export type SocialAuthProfileMap = {
	APPLE: BaseProfile & {
		provider: 'APPLE'
		/** Apple ID tokens never carry the name (it only comes in the first authorization response). */
		name: null
		avatar: null
	}
	FACEBOOK: BaseProfile & {
		provider: 'FACEBOOK'
		name: string | null
		avatar: string | null
	}
	GOOGLE: BaseProfile & {
		provider: 'GOOGLE'
		name: string | null
		avatar: string | null
	}
	MICROSOFT: BaseProfile & {
		provider: 'MICROSOFT'
		name: string | null
		/** Microsoft ID tokens never carry a photo (Graph requires a separate call). */
		avatar: null
	}
}

/** Discriminated union of all provider profiles — narrow via the `provider` field. */
export type SocialAuthProfile = SocialAuthProfileMap[SocialAuthProvider]

/** Profile type for a specific provider. */
export type SocialAuthProfileOf<P extends SocialAuthProvider> =
	SocialAuthProfileMap[P]

export type SocialAuthModuleOptions = {
	apple?: {
		clientId: string
	}
	facebook?: {}
	google?: {
		clientId: string
	}
	microsoft?: {
		tenantId?: string
	}
}
