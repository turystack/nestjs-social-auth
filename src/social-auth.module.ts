import { type DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'

import type { ISocialAuthAdapter } from '@/social-auth.adapter.interface.js'
import { SOCIAL_AUTH_ADAPTERS } from '@/social-auth.constants.js'
import { SocialAuthService } from '@/social-auth.service.js'
import type {
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
			exports: [
				SocialAuthService,
			],
			imports: [
				ConfigModule,
			],
			module: SocialAuthModule,
			providers: [
				{
					inject: [
						ConfigService,
					],
					provide: SOCIAL_AUTH_ADAPTERS,
					useFactory: (config: ConfigService) => {
						const opts = factory(config)

						const adapters = new Map<SocialAuthProvider, ISocialAuthAdapter>()

						if (opts.providers.google) {
							adapters.set(
								'GOOGLE',
								new GoogleAdapter(opts.providers.google.clientId),
							)
						}

						if (opts.providers.facebook) {
							adapters.set('FACEBOOK', new FacebookAdapter())
						}

						if (opts.providers.microsoft) {
							adapters.set(
								'MICROSOFT',
								new MicrosoftAdapter(opts.providers.microsoft.tenantId),
							)
						}

						if (opts.providers.apple) {
							adapters.set(
								'APPLE',
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
