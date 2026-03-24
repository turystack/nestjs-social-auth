import { Inject, Injectable } from '@nestjs/common'

import type { ISocialAuthAdapter } from '@/social-auth.adapter.interface.js'
import { SOCIAL_AUTH_ADAPTERS } from '@/social-auth.constants.js'
import type {
	SocialAuthInput,
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

	async resolveIdentity(input: SocialAuthInput): Promise<SocialAuthProfile> {
		const adapter = this.adapters.get(input.provider)

		if (!adapter) {
			throw new SocialAuthUnauthorizedException(
				`Provider "${input.provider}" is not configured.`,
			)
		}

		return adapter.resolveIdentity(input.token)
	}
}
