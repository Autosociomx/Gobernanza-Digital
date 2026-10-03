import { describe, expect, it } from 'vitest';
import { hasAssuranceAtLeast } from '../contracts';
import { LlaveMxNotConnectedProvider } from '../providers/llaveMxNotConnected';

describe('Identity Gateway contracts', () => {
  it('orders assurance levels without treating phone OTP as verified identity', () => {
    expect(hasAssuranceAtLeast('PHONE_OTP', 'PHONE_OTP')).toBe(true);
    expect(hasAssuranceAtLeast('PHONE_OTP', 'IDENTITY_VERIFIED')).toBe(false);
    expect(hasAssuranceAtLeast('PASSKEY', 'PHONE_OTP')).toBe(true);
  });

  it('keeps Llave MX explicitly not connected in P1', async () => {
    const provider = new LlaveMxNotConnectedProvider();
    const result = await provider.authenticate({ provider: 'llave_mx' });

    expect(provider.connectionState).toBe('NOT_CONNECTED');
    expect(result).toEqual({
      ok: false,
      code: 'NOT_CONNECTED',
      message: 'Llave MX no está integrada institucionalmente en este entorno.',
    });
  });
});
