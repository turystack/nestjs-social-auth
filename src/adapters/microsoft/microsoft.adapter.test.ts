import { describe, expect, it, vi } from 'vitest'

import { MicrosoftAdapter } from './microsoft.adapter.js'

import { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'

vi.mock('jose', () => ({
	createRemoteJWKSet: vi.fn(() => 'mock-jwks'),
	jwtVerify: vi.fn(),
}))

import { jwtVerify } from 'jose'

const mockedJwtVerify = vi.mocked(jwtVerify)

describe('MicrosoftAdapter', () => {
	const adapter = new MicrosoftAdapter('tenant-123')

	it('should return a normalized profile using oid claim', async () => {
		mockedJwtVerify.mockResolvedValueOnce({
			payload: {
				email: 'user@outlook.com',
				name: 'John Microsoft',
				oid: 'ms-oid-123',
				preferred_username: 'john@company.com',
				sub: 'ms-sub-456',
			},
			protectedHeader: {
				alg: 'RS256',
			},
		} as any)

		const profile = await adapter.resolveIdentity('valid-token')

		expect(profile).toEqual({
			avatar: null,
			email: 'john@company.com',
			id: 'ms-oid-123',
			name: 'John Microsoft',

		})
	})

	it('should fallback to sub when oid is missing', async () => {
		mockedJwtVerify.mockResolvedValueOnce({
			payload: {
				email: 'user@outlook.com',
				name: 'Jane Microsoft',
				sub: 'ms-sub-789',
			},
			protectedHeader: {
				alg: 'RS256',
			},
		} as any)

		const profile = await adapter.resolveIdentity('token-no-oid')

		expect(profile.id).toBe('ms-sub-789')
	})

	it('should fallback to email when preferred_username is missing', async () => {
		mockedJwtVerify.mockResolvedValueOnce({
			payload: {
				email: 'fallback@outlook.com',
				sub: 'ms-sub-000',
			},
			protectedHeader: {
				alg: 'RS256',
			},
		} as any)

		const profile = await adapter.resolveIdentity('token')

		expect(profile.email).toBe('fallback@outlook.com')
	})

	it('should throw SocialAuthUnauthorizedException for invalid token', async () => {
		mockedJwtVerify.mockRejectedValueOnce(new Error('invalid token'))

		await expect(adapter.resolveIdentity('invalid-token')).rejects.toThrow(
			SocialAuthUnauthorizedException,
		)
	})
})
