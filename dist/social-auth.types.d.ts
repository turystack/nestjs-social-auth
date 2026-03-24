export declare enum SocialAuthProvider {
    APPLE = "APPLE",
    FACEBOOK = "FACEBOOK",
    GOOGLE = "GOOGLE",
    MICROSOFT = "MICROSOFT"
}
export type SocialAuthProfile = {
    avatar: string | null;
    email: string | null;
    id: string;
    name: string | null;
};
export type SocialAuthInput = {
    provider: SocialAuthProvider;
    token: string;
};
export type SocialAuthProviderConfig = {
    apple?: {
        clientId: string;
    };
    facebook?: {};
    google?: {
        clientId: string;
    };
    microsoft?: {
        tenantId?: string;
    };
};
export type SocialAuthOptions = {
    providers: SocialAuthProviderConfig;
};
export type SocialAuthModuleOptions = {
    imports?: any[];
    inject?: any[];
    useFactory: (...args: any[]) => SocialAuthOptions | Promise<SocialAuthOptions>;
};
//# sourceMappingURL=social-auth.types.d.ts.map