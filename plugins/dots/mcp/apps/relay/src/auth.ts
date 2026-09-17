import { createHash, randomBytes } from 'node:crypto';
import { check, PortalError } from '../../../packages/protocol/src/index.js';
import { RelayStore } from '../../../packages/storage/src/postgres.js';
export interface AuthConfig {
    issuer: string;
    audience: string;
    jwksUri: string;
    publicOrigin: string;
    testOnly: boolean;
    ownerClientId?: string;
    ownerClientSecret?: string;
    authorizationEndpoint?: string;
    tokenEndpoint?: string;
}
export interface Principal {
    accountId: string;
    subject: string;
    scopes: string[];
}
export class OAuthResourceServer {
    private jwks: any;
    constructor(public config: AuthConfig, public store: RelayStore) { check(config.publicOrigin.startsWith('https://') || config.testOnly, 'FORBIDDEN', 'Production public origin must use HTTPS'); for (const endpoint of [config.authorizationEndpoint, config.tokenEndpoint].filter(Boolean)) {
        check(endpoint!.startsWith('https://') || config.testOnly, 'FORBIDDEN', 'Production OIDC endpoints must use HTTPS');
    } check(config.issuer.startsWith('https://') || config.testOnly, 'FORBIDDEN', 'Production issuer must use HTTPS'); check(config.jwksUri.startsWith('https://') || config.testOnly, 'FORBIDDEN', 'Production JWKS must use HTTPS'); check(process.env.NODE_ENV !== 'production' || !config.testOnly, 'FORBIDDEN', 'Test issuer is forbidden in production'); }
    async verify(token: string, audience = this.config.audience) { const { createRemoteJWKSet, jwtVerify } = await import('jose'); this.jwks ??= createRemoteJWKSet(new URL(this.config.jwksUri), { timeoutDuration: 5000, cooldownDuration: 30000 }); const result = await jwtVerify(token, this.jwks, { issuer: this.config.issuer, audience, algorithms: ['RS256', 'ES256'], clockTolerance: 60, requiredClaims: ['exp', 'iat', 'sub'] }); check(typeof result.payload.sub === 'string' && result.payload.sub.length <= 200, 'UNAUTHENTICATED', 'JWT subject is invalid'); return result.payload; }
    async principal(header: string | undefined) { check(header?.startsWith('Bearer '), 'UNAUTHENTICATED', 'Bearer access token required'); const token = header!.slice(7); check(token.length <= 16384, 'UNAUTHENTICATED', 'Token too large'); try {
        const p = await this.verify(token), subject = p.sub;
        check(typeof subject === 'string' && subject.length <= 200, 'UNAUTHENTICATED', 'JWT subject is invalid');
        const scopes = typeof p.scope === 'string' ? p.scope.split(' ').filter(Boolean) : [];
        return { accountId: await this.store.account(this.config.issuer, subject), subject, scopes };
    }
    catch (e) {
        if (e instanceof PortalError)
            throw e;
        throw new PortalError('UNAUTHENTICATED', 'Access token signature, issuer, audience or lifetime is invalid', {}, 'never');
    } }
    require(principal: Principal, scope: string) { check(principal.scopes.includes(scope), 'FORBIDDEN', 'Required OAuth scope is missing', { scope }); }
    challenge(scope = 'portal:read') { return `Bearer resource_metadata="${this.config.publicOrigin}/.well-known/oauth-protected-resource", scope="${scope}"`; }
    metadata() { return { resource: this.config.audience, authorization_servers: [this.config.issuer], scopes_supported: ['portal:read', 'portal:write', 'portal:exec', 'portal:documents', 'portal:network', 'portal:owner'], bearer_methods_supported: ['header'] }; }
}
