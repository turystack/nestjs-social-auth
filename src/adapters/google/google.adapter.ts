import { createRemoteJWKSet, jwtVerify } from 'jose'

import type { ISocialAuthAdapter } from '@/social-auth.adapter.interface.js'
import type { SocialAuthProfile } from '@/social-auth.types.js'

import { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'

const GOOGLE_JWKS_URI = 'https://www.googleapis.com/oauth2/v3/certs'
const GOOGLE_ISSUER = 'https://accounts.google.com'

export class GoogleAdapter implements ISocialAuthAdapter {
	private readonly jwks = createRemoteJWKSet(new URL(GOOGLE_JWKS_URI))

	constructor(private readonly clientId: string) {}

	async resolveIdentity(token: string): Promise<SocialAuthProfile> {
		try {
			const { payload } = await jwtVerify(token, this.jwks, {
				audience: this.clientId,
				issuer: GOOGLE_ISSUER,
			})

			return {
				avatar: (payload.picture as string) ?? null,
				email: (payload.email as string) ?? null,
				id: payload.sub!,
				name: (payload.name as string) ?? null,
			}
		} catch {
			throw new SocialAuthUnauthorizedException()
		}
	}
}
