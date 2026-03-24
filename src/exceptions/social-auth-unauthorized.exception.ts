import { UnauthorizedException } from '@nestjs/common'

export class SocialAuthUnauthorizedException extends UnauthorizedException {
	constructor(message = 'Social authentication failed.') {
		super(message)
	}
}
