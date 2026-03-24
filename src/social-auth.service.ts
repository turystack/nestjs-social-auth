import { Inject, Injectable } from '@nestjs/common'

import type { ISocialAuthAdapter } from '@/social-auth.adapter.interface.js'
import { SOCIAL_AUTH_ADAPTERS } from '@/social-auth.constants.js'
import type {
	SocialAuthProfile,
	SocialAuthProvider,
} from '@/social-auth.types.js'

import { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'

@Injectable()
export class SocialAuthService {
	constructor(
		@Inject(SOCIAL_AUTH_ADAPTERS)
		private readonly adapters: Map<SocialAuthProvider, ISocialAuthAdapter>,
	) {}

	async resolveIdentity(
		provider: SocialAuthProvider,
		token: string,
	): Promise<SocialAuthProfile> {
		const adapter = this.adapters.get(provider)

		if (!adapter) {
			throw new SocialAuthUnauthorizedException(
				`Provider "${provider}" is not configured.`,
			)
		}

		return adapter.resolveIdentity(token)
	}
}
