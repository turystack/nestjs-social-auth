import type { ISocialAuthAdapter } from '@/social-auth.adapter.interface.js'
import type { SocialAuthProfile } from '@/social-auth.types.js'

import { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'

const GRAPH_API_URL = 'https://graph.facebook.com/v25.0/me'
const GRAPH_API_FIELDS = 'id,name,email,picture.type(large)'

export class FacebookAdapter implements ISocialAuthAdapter {
	async resolveIdentity(token: string): Promise<SocialAuthProfile> {
		try {
			const url = `${GRAPH_API_URL}?fields=${GRAPH_API_FIELDS}&access_token=${encodeURIComponent(token)}`
			const response = await fetch(url)

			if (!response.ok) {
				throw new SocialAuthUnauthorizedException()
			}

			const data = (await response.json()) as Record<string, any>

			if (!data.id) {
				throw new SocialAuthUnauthorizedException()
			}

			return {
				avatar: data.picture?.data?.url ?? null,
				email: data.email ?? null,
				id: data.id,
				name: data.name ?? null,
			}
		} catch (error) {
			if (error instanceof SocialAuthUnauthorizedException) {
				throw error
			}
			throw new SocialAuthUnauthorizedException()
		}
	}
}
