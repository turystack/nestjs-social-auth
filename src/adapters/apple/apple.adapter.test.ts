import { describe, expect, it, vi } from 'vitest'

import { AppleAdapter } from './apple.adapter.js'

import { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'

vi.mock('jose', () => ({
	createRemoteJWKSet: vi.fn(() => 'mock-jwks'),
	jwtVerify: vi.fn(),
}))

import { jwtVerify } from 'jose'

const mockedJwtVerify = vi.mocked(jwtVerify)

describe('AppleAdapter', () => {
	const adapter = new AppleAdapter('com.example.app')

	it('should return a normalized profile for a valid token', async () => {
		mockedJwtVerify.mockResolvedValueOnce({
			payload: {
				email: 'user@privaterelay.appleid.com',
				sub: 'apple-user-123',
			},
			protectedHeader: {
				alg: 'ES256',
			},
		} as any)

		const profile = await adapter.resolveIdentity('valid-token')

		expect(profile).toEqual({
			avatar: null,
			email: 'user@privaterelay.appleid.com',
			id: 'apple-user-123',
			name: null,

		})
	})

	it('should return null email when not present', async () => {
		mockedJwtVerify.mockResolvedValueOnce({
			payload: {
				sub: 'apple-user-456',
			},
			protectedHeader: {
				alg: 'ES256',
			},
		} as any)

		const profile = await adapter.resolveIdentity('subsequent-login')

		expect(profile).toEqual({
			avatar: null,
			email: null,
			id: 'apple-user-456',
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
