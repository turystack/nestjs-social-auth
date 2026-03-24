var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Inject, Injectable } from '@nestjs/common';
import { SOCIAL_AUTH_ADAPTERS } from './social-auth.constants.js';
import { SocialAuthUnauthorizedException } from './exceptions/social-auth-unauthorized.exception.js';
let SocialAuthService = class SocialAuthService {
    adapters;
    constructor(adapters) {
        this.adapters = adapters;
    }
    async resolveIdentity(input) {
        const adapter = this.adapters.get(input.provider);
        if (!adapter) {
            throw new SocialAuthUnauthorizedException(`Provider "${input.provider}" is not configured.`);
        }
        return adapter.resolveIdentity(input.token);
    }
};
SocialAuthService = __decorate([
    Injectable(),
    __param(0, Inject(SOCIAL_AUTH_ADAPTERS)),
    __metadata("design:paramtypes", [Map])
], SocialAuthService);
export { SocialAuthService };
//# sourceMappingURL=social-auth.service.js.map