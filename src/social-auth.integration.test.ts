import { Injectable, Module } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { describe, expect, it } from 'vitest'

import { SocialAuthModule } from '@/social-auth.module.js'
import { SocialAuthService } from '@/social-auth.service.js'

@Injectable()
class DomainService {
	constructor(public readonly socialAuth: SocialAuthService) {}
}

@Module({
	providers: [
		DomainService,
	],
})
class DomainLibModule {}

describe('SocialAuthModule (integration)', () => {
	it('should share the app-wide SocialAuthService with domain libs', async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [
				SocialAuthModule.register({
					google: {
						clientId: 'google-client',
					},
				}),
				DomainLibModule,
			],
		}).compile()

		const domainService = moduleRef.get(DomainService)
		expect(domainService.socialAuth).toBeInstanceOf(SocialAuthService)
		expect(domainService.socialAuth).toBe(moduleRef.get(SocialAuthService))
	})
})
