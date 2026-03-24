export type SocialAuthProvider = 'APPLE' | 'FACEBOOK' | 'GOOGLE' | 'MICROSOFT'

export type SocialAuthProfile = {
	avatar: string | null
	email: string | null
	id: string
	name: string | null
}

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
