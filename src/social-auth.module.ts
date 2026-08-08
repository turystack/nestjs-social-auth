import { type DynamicModule, Module } from '@nestjs/common'
import { ConfigService } from '@turystack/nestjs-config'

import type { ISocialAuthAdapter } from '@/social-auth.adapter.interface.js'
import { SOCIAL_AUTH_ADAPTERS } from '@/social-auth.constants.js'
import { SocialAuthService } from '@/social-auth.service.js'
import type {
	SocialAuthModuleOptions,
	SocialAuthProvider,
} from '@/social-auth.types.js'

import { AppleAdapter } from '@/adapters/apple/index.js'
import { FacebookAdapter } from '@/adapters/facebook/index.js'
import { GoogleAdapter } from '@/adapters/google/index.js'
import { MicrosoftAdapter } from '@/adapters/microsoft/index.js'

@Module({})
export class SocialAuthModule {
	/**
	 * Registers the social-auth globally: adapters are created once and shared
	 * app-wide. Register it a single time in the app root; domain services
	 * (monorepo libs) just inject {@link SocialAuthService}.
	 *
	 * The `(config) => options` factory form injects the `ConfigService` from
	 * `@turystack/nestjs-config` at boot.
	 */
	static register(
		options:
			| SocialAuthModuleOptions
			| ((config: ConfigService) => SocialAuthModuleOptions),
	): DynamicModule {
		return {
			exports: [
				SocialAuthService,
			],
			global: true,
			module: SocialAuthModule,
			providers: [
				{
					inject: [
						{
							optional: true,
							token: ConfigService,
						},
					],
					provide: SOCIAL_AUTH_ADAPTERS,
					useFactory: (config?: ConfigService) => {
						const resolved = SocialAuthModule._resolveOptions(options, config)
						const adapters = new Map<SocialAuthProvider, ISocialAuthAdapter>()

						if (resolved.google) {
							adapters.set(
								'GOOGLE',
								new GoogleAdapter(resolved.google.clientId),
							)
						}

						if (resolved.facebook) {
							adapters.set('FACEBOOK', new FacebookAdapter())
						}

						if (resolved.microsoft) {
							adapters.set(
								'MICROSOFT',
								new MicrosoftAdapter(resolved.microsoft.tenantId),
							)
						}

						if (resolved.apple) {
							adapters.set('APPLE', new AppleAdapter(resolved.apple.clientId))
						}

						return adapters
					},
				},
				SocialAuthService,
			],
		}
	}

	private static _resolveOptions(
		optionsOrFactory:
			| SocialAuthModuleOptions
			| ((config: ConfigService) => SocialAuthModuleOptions),
		config?: ConfigService,
	): SocialAuthModuleOptions {
		if (typeof optionsOrFactory !== 'function') {
			return optionsOrFactory
		}

		if (!config) {
			throw new Error(
				'[SocialAuthModule] register((config) => ...) requires ConfigModule (@turystack/nestjs-config) to be registered',
			)
		}

		return optionsOrFactory(config)
	}
}
