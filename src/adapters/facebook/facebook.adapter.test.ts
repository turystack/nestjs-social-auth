import { afterEach, describe, expect, it, vi } from 'vitest'

import { FacebookAdapter } from './facebook.adapter.js'

import { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'

describe('FacebookAdapter', () => {
	const adapter = new FacebookAdapter()

	afterEach(() => {
		vi.restoreAllMocks()
	})

	it('should return a normalized profile for a valid token', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			json: async () => ({
				email: 'user@facebook.com',
				id: 'fb-user-123',
				name: 'Jane Doe',
				picture: {
					data: {
						url: 'https://graph.facebook.com/photo.jpg',
					},
				},
			}),
			ok: true,
		} as Response)

		const profile = await adapter.resolveIdentity('valid-access-token')

		expect(profile).toEqual({
			avatar: 'https://graph.facebook.com/photo.jpg',
			email: 'user@facebook.com',
			id: 'fb-user-123',
			name: 'Jane Doe',

		})
	})

	it('should return null for missing optional fields', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			json: async () => ({
				id: 'fb-user-456',
			}),
			ok: true,
		} as Response)

		const profile = await adapter.resolveIdentity('minimal-token')

		expect(profile).toEqual({
			avatar: null,
			email: null,
			id: 'fb-user-456',
			name: null,

		})
	})

	it('should throw when response is not ok', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			ok: false,
			status: 401,
		} as Response)

		await expect(adapter.resolveIdentity('bad-token')).rejects.toThrow(
			SocialAuthUnauthorizedException,
		)
	})

	it('should throw when response has no id', async () => {
		vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
			json: async () => ({
				error: {
					message: 'Invalid token',
				},
			}),
			ok: true,
		} as Response)

		await expect(adapter.resolveIdentity('invalid-token')).rejects.toThrow(
			SocialAuthUnauthorizedException,
		)
	})

	it('should throw when fetch fails', async () => {
		vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
			new Error('Network error'),
		)

		await expect(adapter.resolveIdentity('token')).rejects.toThrow(
			SocialAuthUnauthorizedException,
		)
	})
})
