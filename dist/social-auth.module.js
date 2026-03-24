var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SocialAuthModule_1;
import { Module } from '@nestjs/common';
import { SOCIAL_AUTH_ADAPTERS, SOCIAL_AUTH_OPTIONS, } from './social-auth.constants.js';
import { SocialAuthService } from './social-auth.service.js';
import { AppleAdapter } from './adapters/apple/index.js';
import { FacebookAdapter } from './adapters/facebook/index.js';
import { GoogleAdapter } from './adapters/google/index.js';
import { MicrosoftAdapter } from './adapters/microsoft/index.js';
let SocialAuthModule = SocialAuthModule_1 = class SocialAuthModule {
    static register(options) {
        return {
            exports: [
                SocialAuthService,
            ],
            imports: options.imports ?? [],
            module: SocialAuthModule_1,
            providers: [
                {
                    inject: options.inject ?? [],
                    provide: SOCIAL_AUTH_OPTIONS,
                    useFactory: options.useFactory,
                },
                {
                    inject: [
                        SOCIAL_AUTH_OPTIONS,
                    ],
                    provide: SOCIAL_AUTH_ADAPTERS,
                    useFactory: (opts) => {
                        const adapters = new Map();
                        if (opts.providers.google) {
                            adapters.set('GOOGLE', new GoogleAdapter(opts.providers.google.clientId));
                        }
                        if (opts.providers.facebook) {
                            adapters.set('FACEBOOK', new FacebookAdapter());
                        }
                        if (opts.providers.microsoft) {
                            adapters.set('MICROSOFT', new MicrosoftAdapter(opts.providers.microsoft.tenantId));
                        }
                        if (opts.providers.apple) {
                            adapters.set('APPLE', new AppleAdapter(opts.providers.apple.clientId));
                        }
                        return adapters;
                    },
                },
                SocialAuthService,
            ],
        };
    }
};
SocialAuthModule = SocialAuthModule_1 = __decorate([
    Module({})
], SocialAuthModule);
export { SocialAuthModule };
//# sourceMappingURL=social-auth.module.js.map