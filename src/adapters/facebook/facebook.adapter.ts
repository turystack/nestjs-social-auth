import type { ISocialAuthAdapter } from '@/social-auth.adapter.interface.js'
import type { SocialAuthProfileOf } from '@/social-auth.types.js'

import { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'

const GRAPH_API_URL = 'https://graph.facebook.com/v25.0/me'
const GRAPH_API_FIELDS = 'id,name,email,picture.type(large)'

export class FacebookAdapter implements ISocialAuthAdapter<'FACEBOOK'> {
	async resolveIdentity(
		token: string,
	): Promise<SocialAuthProfileOf<'FACEBOOK'>> {
		try {
			const url = `${GRAPH_API_URL}?fields=${GRAPH_API_FIELDS}&access_token=${encodeURIComponent(token)}`
			const response = await fetch(url)

			if (!response.ok) {
				throw new SocialAuthUnauthorizedException()
			}

			const data = (await response.json()) as {
				id?: string
				name?: string
				email?: string
				picture?: {
					data?: {
						url?: string
					}
				}
			}

			if (!data.id) {
				throw new SocialAuthUnauthorizedException()
			}

			return {
				avatar: data.picture?.data?.url ?? null,
				email: data.email ?? null,
				id: data.id,
				name: data.name ?? null,
				provider: 'FACEBOOK',
			}
		} catch (error) {
			if (error instanceof SocialAuthUnauthorizedException) {
				throw error
			}
			throw new SocialAuthUnauthorizedException()
		}
	}
}
