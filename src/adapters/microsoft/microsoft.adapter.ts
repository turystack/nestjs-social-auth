import { createRemoteJWKSet, jwtVerify } from 'jose'

import type { ISocialAuthAdapter } from '@/social-auth.adapter.interface.js'
import type { SocialAuthProfileOf } from '@/social-auth.types.js'

import { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'

export class MicrosoftAdapter implements ISocialAuthAdapter<'MICROSOFT'> {
	private readonly jwks: ReturnType<typeof createRemoteJWKSet>

	constructor(tenantId = 'common') {
		const jwksUri = `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`
		this.jwks = createRemoteJWKSet(new URL(jwksUri))
	}

	async resolveIdentity(
		token: string,
	): Promise<SocialAuthProfileOf<'MICROSOFT'>> {
		try {
			const { payload } = await jwtVerify(token, this.jwks)

			const id = (payload.oid as string) ?? payload.sub!

			// `preferred_username` is a UPN — often an email, but it can be a
			// phone number or an arbitrary username, so it is only a fallback
			// and only when it looks like an email.
			const preferredUsername = payload.preferred_username as string | undefined
			const email =
				(payload.email as string) ??
				(preferredUsername?.includes('@') ? preferredUsername : null)

			return {
				avatar: null,
				email,
				id,
				name: (payload.name as string) ?? null,
				provider: 'MICROSOFT',
			}
		} catch {
			throw new SocialAuthUnauthorizedException()
		}
	}
}
