import type { FactoryProvider, Provider } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { ConfigModule } from '@turystack/nestjs-config'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import type { ISocialAuthAdapter } from '@/social-auth.adapter.interface.js'
import { SOCIAL_AUTH_ADAPTERS } from '@/social-auth.constants.js'
import { SocialAuthModule } from '@/social-auth.module.js'
import { SocialAuthService } from '@/social-auth.service.js'
import type { SocialAuthProvider } from '@/social-auth.types.js'

import { AppleAdapter } from '@/adapters/apple/index.js'
import { FacebookAdapter } from '@/adapters/facebook/index.js'
import { GoogleAdapter } from '@/adapters/google/index.js'
import { MicrosoftAdapter } from '@/adapters/microsoft/index.js'

const getAdapters = (
	options: Parameters<typeof SocialAuthModule.register>[0],
): Map<SocialAuthProvider, ISocialAuthAdapter> => {
	const dynamicModule = SocialAuthModule.register(options)
	const adaptersProvider = dynamicModule.providers?.find(
		(provider: Provider) =>
			typeof provider === 'object' &&
			'provide' in provider &&
			provider.provide === SOCIAL_AUTH_ADAPTERS,
	) as FactoryProvider

	return adaptersProvider.useFactory()
}

describe('SocialAuthModule', () => {
	afterEach(() => {
		vi.unstubAllEnvs()
	})

	describe('register', () => {
		it('should expose SocialAuthService globally', () => {
			const dynamicModule = SocialAuthModule.register({})

			expect(dynamicModule.module).toBe(SocialAuthModule)
			expect(dynamicModule.global).toBe(true)
			expect(dynamicModule.exports).toEqual([
				SocialAuthService,
			])
			expect(dynamicModule.providers).toContain(SocialAuthService)
		})

		it('should build one adapter per configured provider', () => {
			const adapters = getAdapters({
				apple: {
					clientId: 'apple-client',
				},
				facebook: {},
				google: {
					clientId: 'google-client',
				},
				microsoft: {
					tenantId: 'tenant',
				},
			})

			expect(adapters.size).toBe(4)
			expect(adapters.get('GOOGLE')).toBeInstanceOf(GoogleAdapter)
			expect(adapters.get('FACEBOOK')).toBeInstanceOf(FacebookAdapter)
			expect(adapters.get('MICROSOFT')).toBeInstanceOf(MicrosoftAdapter)
			expect(adapters.get('APPLE')).toBeInstanceOf(AppleAdapter)
		})

		it('should build no adapters when no provider is configured', () => {
			const adapters = getAdapters({})

			expect(adapters.size).toBe(0)
		})

		it('should only build the configured providers', () => {
			const adapters = getAdapters({
				google: {
					clientId: 'google-client',
				},
			})

			expect(adapters.size).toBe(1)
			expect(adapters.get('GOOGLE')).toBeInstanceOf(GoogleAdapter)
			expect(adapters.get('APPLE')).toBeUndefined()
		})

		it('should resolve options from a config factory', async () => {
			vi.stubEnv('GOOGLE_CLIENT_ID', 'factory-google-client')

			const moduleRef = await Test.createTestingModule({
				imports: [
					ConfigModule.register({
						envFilePath: false,
						schema: {
							GOOGLE_CLIENT_ID: z.string(),
						},
					}),
					SocialAuthModule.register((config) => ({
						google: {
							clientId: config.get('GOOGLE_CLIENT_ID') as string,
						},
					})),
				],
			}).compile()

			const adapters = moduleRef.get<Map<string, unknown>>(SOCIAL_AUTH_ADAPTERS)

			expect(adapters.size).toBe(1)
			expect(adapters.get('GOOGLE')).toBeInstanceOf(GoogleAdapter)
		})

		it('should reject a config factory without ConfigModule', async () => {
			await expect(
				Test.createTestingModule({
					imports: [
						SocialAuthModule.register((config) => ({
							google: {
								clientId: config.get('GOOGLE_CLIENT_ID') as string,
							},
						})),
					],
				}).compile(),
			).rejects.toThrow(
				'requires ConfigModule (@turystack/nestjs-config) to be registered',
			)
		})
	})
})
