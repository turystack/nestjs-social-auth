import { describe, expect, it, vi } from 'vitest'

import { GoogleAdapter } from './google.adapter.js'

import { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'

vi.mock('jose', () => ({
	createRemoteJWKSet: vi.fn(() => 'mock-jwks'),
	jwtVerify: vi.fn(),
}))

import { jwtVerify } from 'jose'

const mockedJwtVerify = vi.mocked(jwtVerify)

describe('GoogleAdapter', () => {
	const adapter = new GoogleAdapter('google-client-id')

	it('should return a normalized profile for a valid token', async () => {
		mockedJwtVerify.mockResolvedValueOnce({
			payload: {
				email: 'user@gmail.com',
				name: 'John Doe',
				picture: 'https://lh3.googleusercontent.com/photo.jpg',
				sub: 'google-user-123',
			},
			protectedHeader: {
				alg: 'RS256',
			},
		} as any)

		const profile = await adapter.resolveIdentity('valid-token')

		expect(profile).toEqual({
			avatar: 'https://lh3.googleusercontent.com/photo.jpg',
			email: 'user@gmail.com',
			id: 'google-user-123',
			name: 'John Doe',

		})
	})

	it('should return null for missing optional claims', async () => {
		mockedJwtVerify.mockResolvedValueOnce({
			payload: {
				sub: 'google-user-456',
			},
			protectedHeader: {
				alg: 'RS256',
			},
		} as any)

		const profile = await adapter.resolveIdentity('minimal-token')

		expect(profile).toEqual({
			avatar: null,
			email: null,
			id: 'google-user-456',
			name: null,

		})
	})

	it('should throw SocialAuthUnauthorizedException for invalid token', async () => {
		mockedJwtVerify.mockRejectedValueOnce(new Error('invalid token'))

		await expect(adapter.resolveIdentity('invalid-token')).rejects.toThrow(
			SocialAuthUnauthorizedException,
		)
	})
})
