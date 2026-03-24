import { type DynamicModule, Module } from '@nestjs/common'

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
	static register(options: SocialAuthModuleOptions): DynamicModule {
		return {
			exports: [
				SocialAuthService,
			],
			module: SocialAuthModule,
			providers: [
				{
					provide: SOCIAL_AUTH_ADAPTERS,
					useFactory: () => {
						const adapters = new Map<SocialAuthProvider, ISocialAuthAdapter>()

						if (options.google) {
							adapters.set('GOOGLE', new GoogleAdapter(options.google.clientId))
						}

						if (options.facebook) {
							adapters.set('FACEBOOK', new FacebookAdapter())
						}

						if (options.microsoft) {
							adapters.set(
								'MICROSOFT',
								new MicrosoftAdapter(options.microsoft.tenantId),
							)
						}

						if (options.apple) {
							adapters.set('APPLE', new AppleAdapter(options.apple.clientId))
						}

						return adapters
					},
				},
				SocialAuthService,
			],
		}
	}
}
