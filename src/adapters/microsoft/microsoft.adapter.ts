import { createRemoteJWKSet, jwtVerify } from 'jose'

import type { ISocialAuthAdapter } from '@/social-auth.adapter.interface.js'
import type { SocialAuthProfile } from '@/social-auth.types.js'

import { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'

export class MicrosoftAdapter implements ISocialAuthAdapter {
	private readonly jwks: ReturnType<typeof createRemoteJWKSet>

	constructor(tenantId = 'common') {
		const jwksUri = `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`
		this.jwks = createRemoteJWKSet(new URL(jwksUri))
	}

	async resolveIdentity(token: string): Promise<SocialAuthProfile> {
		try {
			const { payload } = await jwtVerify(token, this.jwks)

			const id = (payload.oid as string) ?? payload.sub!

			return {
				avatar: null,
				email:
					(payload.preferred_username as string) ??
					(payload.email as string) ??
					null,
				id,
				name: (payload.name as string) ?? null,
			}
		} catch {
			throw new SocialAuthUnauthorizedException()
		}
	}
}
