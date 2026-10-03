import type {
  AuthRequest,
  AuthResult,
  IdentityProvider,
} from '../contracts';

export class LlaveMxNotConnectedProvider implements IdentityProvider {
  readonly kind = 'llave_mx' as const;
  readonly connectionState = 'NOT_CONNECTED' as const;

  async authenticate(_request: AuthRequest): Promise<AuthResult> {
    return {
      ok: false,
      code: 'NOT_CONNECTED',
      message:
        'Llave MX no está integrada institucionalmente en este entorno.',
    };
  }
}
