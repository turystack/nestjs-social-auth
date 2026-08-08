import { Inject, Injectable } from '@nestjs/common'

import type { ISocialAuthAdapter } from '@/social-auth.adapter.interface.js'
import { SOCIAL_AUTH_ADAPTERS } from '@/social-auth.constants.js'
import type {
	SocialAuthProfileOf,
	SocialAuthProvider,
} from '@/social-auth.types.js'

import { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'

@Injectable()
export class SocialAuthService {
	constructor(
		@Inject(SOCIAL_AUTH_ADAPTERS)
		private readonly adapters: Map<SocialAuthProvider, ISocialAuthAdapter>,
	) {}

	/**
	 * Resolves the user identity for the given provider token. The return
	 * type narrows per provider — e.g. `'APPLE'` yields `name: null`.
	 */
	async resolveIdentity<P extends SocialAuthProvider>(
		provider: P,
		token: string,
	): Promise<SocialAuthProfileOf<P>> {
		const adapter = this.adapters.get(provider) as
			| ISocialAuthAdapter<P>
			| undefined

		if (!adapter) {
			throw new SocialAuthUnauthorizedException(
				`Provider "${provider}" is not configured.`,
			)
		}

		return adapter.resolveIdentity(token)
	}
}
