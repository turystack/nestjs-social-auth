import type { ConfigService } from '@nestjs/config'

export type SocialAuthProvider = 'APPLE' | 'FACEBOOK' | 'GOOGLE' | 'MICROSOFT'

export type SocialAuthProfile = {
	avatar: string | null
	email: string | null
	id: string
	name: string | null
}

export type SocialAuthProviderConfig = {
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

export type SocialAuthOptions = {
	providers: SocialAuthProviderConfig
}

export type SocialAuthOptionsFactory = (
	config: ConfigService,
) => SocialAuthOptions
