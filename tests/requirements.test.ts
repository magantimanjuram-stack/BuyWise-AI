import { describe, expect, it } from 'vitest';
import { evaluateNumericRequirement, parseRequirements } from '../server/src/engine/requirements.js';

describe('Natural Language Requirement Engine', () => {
  it('parses RAM, storage, refresh rate, and 5G requirement tokens', () => {
    const text = '16GB RAM required, 512GB SSD storage, 120Hz display, 5G and ANC';
    const reqs = parseRequirements(text);

    const ramReq = reqs.find((r) => r.key === 'ramGB');
    expect(ramReq).toBeDefined();
    expect(ramReq?.numericMin).toBe(16);

    const storageReq = reqs.find((r) => r.key === 'storageGB');
    expect(storageReq).toBeDefined();
    expect(storageReq?.numericMin).toBe(512);

    const refreshReq = reqs.find((r) => r.key === 'refreshRateHz');
    expect(refreshReq).toBeDefined();
    expect(refreshReq?.numericMin).toBe(120);

    const ancReq = reqs.find((r) => r.key === 'hasANC');
    expect(ancReq).toBeDefined();
    expect(ancReq?.targetValue).toBe(true);
  });

  it('evaluates numeric minimums correctly where higher value passes', () => {
    const ramReq = {
      name: '16GB RAM',
      key: 'ramGB' as const,
      targetValue: 16,
      numericMin: 16,
      isHard: true
    };

    // Product has 32GB RAM -> PASS
    const passEval = evaluateNumericRequirement(ramReq, { ramGB: 32 });
    expect(passEval.passes).toBe(true);

    // Product has 16GB RAM -> PASS
    const passExact = evaluateNumericRequirement(ramReq, { ramGB: 16 });
    expect(passExact.passes).toBe(true);

    // Product has 8GB RAM -> FAIL
    const failEval = evaluateNumericRequirement(ramReq, { ramGB: 8 });
    expect(failEval.passes).toBe(false);
  });
});
