import { Test } from '@nestjs/testing'
import { describe, expect, it, vi } from 'vitest'

import { SOCIAL_AUTH_ADAPTERS } from '@/social-auth.constants.js'
import { SocialAuthService } from '@/social-auth.service.js'
import { SocialAuthProvider } from '@/social-auth.types.js'

import { SocialAuthUnauthorizedException } from '@/exceptions/social-auth-unauthorized.exception.js'

describe('SocialAuthService', () => {
	const mockProfile = {
		avatar: 'https://example.com/avatar.jpg',
		email: 'user@example.com',
		id: '123',
		name: 'John Doe',
	}

	const mockAdapter = {
		resolveIdentity: vi.fn().mockResolvedValue(mockProfile),
	}

	async function createService(
		adapters: Map<string, typeof mockAdapter> = new Map([
			[
				'GOOGLE',
				mockAdapter,
			],
		]),
	) {
		const module = await Test.createTestingModule({
			providers: [
				{
					provide: SOCIAL_AUTH_ADAPTERS,
					useValue: adapters,
				},
				SocialAuthService,
			],
		}).compile()

		return module.get(SocialAuthService)
	}

	it('should delegate to the correct adapter', async () => {
		const service = await createService()

		const result = await service.resolveIdentity({
			provider: SocialAuthProvider.GOOGLE,
			token: 'valid-token',
		})

		expect(result).toEqual(mockProfile)
		expect(mockAdapter.resolveIdentity).toHaveBeenCalledWith('valid-token')
	})

	it('should throw when provider is not configured', async () => {
		const service = await createService(new Map())

		await expect(
			service.resolveIdentity({
				provider: SocialAuthProvider.FACEBOOK,
				token: 'token',
			}),
		).rejects.toThrow(SocialAuthUnauthorizedException)
	})

	it('should propagate adapter errors', async () => {
		const failingAdapter = {
			resolveIdentity: vi
				.fn()
				.mockRejectedValue(new SocialAuthUnauthorizedException()),
		}

		const service = await createService(
			new Map([
				[
					'APPLE',
					failingAdapter,
				],
			]) as any,
		)

		await expect(
			service.resolveIdentity({
				provider: SocialAuthProvider.APPLE,
				token: 'bad-token',
			}),
		).rejects.toThrow(SocialAuthUnauthorizedException)
	})
})
