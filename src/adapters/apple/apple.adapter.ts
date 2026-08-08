import { createRemoteJWKSet, jwtVerify } from 'jose'

import type { ISocialAuthAdapter } from '@/social-auth.adapter.interface.js'
import type { SocialAuthProfileOf } from '@/social-auth.types.js'

import { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'

const APPLE_JWKS_URI = 'https://appleid.apple.com/auth/keys'
const APPLE_ISSUER = 'https://appleid.apple.com'

export class AppleAdapter implements ISocialAuthAdapter<'APPLE'> {
	private readonly jwks = createRemoteJWKSet(new URL(APPLE_JWKS_URI))

	constructor(private readonly clientId: string) {}

	async resolveIdentity(token: string): Promise<SocialAuthProfileOf<'APPLE'>> {
		try {
			const { payload } = await jwtVerify(token, this.jwks, {
				audience: this.clientId,
				issuer: APPLE_ISSUER,
			})

			return {
				avatar: null,
				email: (payload.email as string) ?? null,
				id: payload.sub!,
				name: null,
				provider: 'APPLE',
			}
		} catch {
			throw new SocialAuthUnauthorizedException()
		}
	}
}
