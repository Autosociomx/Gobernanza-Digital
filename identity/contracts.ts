export type ActorId = string;
export type CitizenId = string;
export type CredentialId = string;

export type IdentityProviderKind =
  | 'anonymous'
  | 'phone_otp'
  | 'passkey'
  | 'llave_mx';

export type ConnectionState =
  | 'NOT_CONNECTED'
  | 'SANDBOX'
  | 'AUTHORIZED'
  | 'CONNECTED'
  | 'PRODUCTION';

export type AssuranceLevel =
  | 'ANONYMOUS'
  | 'PHONE_OTP'
  | 'PASSKEY'
  | 'IDENTITY_VERIFIED'
  | 'LLAVE_MX';

export interface IdentityCredentialRef {
  credentialId: CredentialId;
  provider: IdentityProviderKind;
  connectionState: ConnectionState;
  verifiedAt?: string;
}

export interface AuthContext {
  actorId: ActorId;
  citizenId?: CitizenId;
  provider: IdentityProviderKind;
  assurance: AssuranceLevel;
  connectionState: ConnectionState;
  userVerified: boolean;
  credentialRef?: IdentityCredentialRef;
}

export interface AuthRequest {
  provider: IdentityProviderKind;
  challenge?: string;
  phoneNumber?: string;
  otp?: string;
  credentialId?: CredentialId;
}

export type AuthResult =
  | {
      ok: true;
      context: AuthContext;
    }
  | {
      ok: false;
      code:
        | 'INVALID_REQUEST'
        | 'AUTH_FAILED'
        | 'NOT_CONNECTED'
        | 'STEP_UP_REQUIRED';
      message: string;
      requiredAssurance?: AssuranceLevel;
    };

export interface IdentityProvider {
  readonly kind: IdentityProviderKind;
  readonly connectionState: ConnectionState;
  authenticate(request: AuthRequest): Promise<AuthResult>;
}

export function assertInstitutionalProviderState(
  provider: IdentityProvider,
): void {
  if (
    provider.kind === 'llave_mx' &&
    provider.connectionState !== 'NOT_CONNECTED' &&
    provider.connectionState !== 'SANDBOX' &&
    provider.connectionState !== 'AUTHORIZED' &&
    provider.connectionState !== 'CONNECTED' &&
    provider.connectionState !== 'PRODUCTION'
  ) {
    throw new Error('Invalid Llave MX connection state');
  }
}

export function hasAssuranceAtLeast(
  actual: AssuranceLevel,
  required: AssuranceLevel,
): boolean {
  const order: Record<AssuranceLevel, number> = {
    ANONYMOUS: 0,
    PHONE_OTP: 1,
    PASSKEY: 2,
    IDENTITY_VERIFIED: 3,
    LLAVE_MX: 4,
  };

  return order[actual] >= order[required];
}
