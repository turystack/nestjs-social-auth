import { type DynamicModule, Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import type { ISocialAuthAdapter } from '@/social-auth.adapter.interface.js'
import {
	SOCIAL_AUTH_ADAPTERS,
	SOCIAL_AUTH_OPTIONS,
} from '@/social-auth.constants.js'
import { SocialAuthService } from '@/social-auth.service.js'
import type {
	SocialAuthOptions,
	SocialAuthOptionsFactory,
	SocialAuthProvider,
} from '@/social-auth.types.js'

import { AppleAdapter } from '@/adapters/apple/index.js'
import { FacebookAdapter } from '@/adapters/facebook/index.js'
import { GoogleAdapter } from '@/adapters/google/index.js'
import { MicrosoftAdapter } from '@/adapters/microsoft/index.js'

@Module({})
export class SocialAuthModule {
	static register(factory: SocialAuthOptionsFactory): DynamicModule {
		return {
			exports: [SocialAuthService],
			module: SocialAuthModule,
			providers: [
				{
					inject: [ConfigService],
					provide: SOCIAL_AUTH_OPTIONS,
					useFactory: (config: ConfigService) => factory(config),
				},
				{
					inject: [SOCIAL_AUTH_OPTIONS],
					provide: SOCIAL_AUTH_ADAPTERS,
					useFactory: (opts: SocialAuthOptions) => {
						const adapters = new Map<SocialAuthProvider, ISocialAuthAdapter>()

						if (opts.providers.google) {
							adapters.set(
								'GOOGLE' as SocialAuthProvider,
								new GoogleAdapter(opts.providers.google.clientId),
							)
						}

						if (opts.providers.facebook) {
							adapters.set(
								'FACEBOOK' as SocialAuthProvider,
								new FacebookAdapter(),
							)
						}

						if (opts.providers.microsoft) {
							adapters.set(
								'MICROSOFT' as SocialAuthProvider,
								new MicrosoftAdapter(opts.providers.microsoft.tenantId),
							)
						}

						if (opts.providers.apple) {
							adapters.set(
								'APPLE' as SocialAuthProvider,
								new AppleAdapter(opts.providers.apple.clientId),
							)
						}

						return adapters
					},
				},
				SocialAuthService,
			],
		}
	}
}
