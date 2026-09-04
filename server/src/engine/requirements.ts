import { ParsedRequirement, ProductSpecification } from '../types/index.js';

export function parseRequirements(text: string): ParsedRequirement[] {
  const reqs: ParsedRequirement[] = [];
  if (!text) return reqs;

  const lower = text.toLowerCase();

  // 1. RAM extraction (e.g. 16GB RAM, 8GB ram, 32 gb ram)
  const ramMatch = lower.match(/(\d+)\s*(?:gb|g)\s*(?:ram|memory)?/);
  if (ramMatch) {
    const ramVal = parseInt(ramMatch[1], 10);
    // If ram is <= 64, it's RAM, otherwise likely storage
    if (ramVal <= 64) {
      const isExplicitHard = lower.includes('ram required') || lower.includes('must have') || lower.includes('need') || true;
      reqs.push({
        name: `${ramVal}GB RAM`,
        key: 'ramGB',
        targetValue: ramVal,
        numericMin: ramVal,
        isHard: isExplicitHard
      });
    }
  }

  // 2. Storage extraction (e.g. 512GB, 256GB, 1TB)
  const storageGbMatch = lower.match(/(\d+)\s*(?:gb|g)\s*(?:storage|ssd|rom)/);
  const storageTbMatch = lower.match(/(\d+)\s*(?:tb|t)\s*(?:storage|ssd)/);

  if (storageTbMatch) {
    const tbVal = parseInt(storageTbMatch[1], 10);
    reqs.push({
      name: `${tbVal}TB Storage`,
      key: 'storageGB',
      targetValue: tbVal * 1000,
      numericMin: tbVal * 1000,
      isHard: true
    });
  } else if (storageGbMatch) {
    const gbVal = parseInt(storageGbMatch[1], 10);
    reqs.push({
      name: `${gbVal}GB Storage`,
      key: 'storageGB',
      targetValue: gbVal,
      numericMin: gbVal,
      isHard: true
    });
  }

  // 3. Refresh Rate (e.g. 120Hz, 144Hz, 240Hz, 90Hz)
  const refreshMatch = lower.match(/(\d+)\s*hz/);
  if (refreshMatch) {
    const hzVal = parseInt(refreshMatch[1], 10);
    reqs.push({
      name: `${hzVal}Hz Refresh Rate`,
      key: 'refreshRateHz',
      targetValue: hzVal,
      numericMin: hzVal,
      isHard: true
    });
  }

  // 4. Camera (e.g. 50MP, 48MP, 200MP)
  const cameraMatch = lower.match(/(\d+)\s*mp/);
  if (cameraMatch) {
    const mpVal = parseInt(cameraMatch[1], 10);
    reqs.push({
      name: `${mpVal}MP Camera`,
      key: 'cameraMP',
      targetValue: mpVal,
      numericMin: mpVal,
      isHard: false
    });
  }

  // 5. 5G
  if (lower.includes('5g')) {
    reqs.push({
      name: '5G Connectivity',
      key: 'has5G',
      targetValue: true,
      isHard: true
    });
  }

  // 6. ANC / Active Noise Cancellation
  if (lower.includes('anc') || lower.includes('noise cancel') || lower.includes('noise reduction')) {
    reqs.push({
      name: 'Active Noise Cancellation (ANC)',
      key: 'hasANC',
      targetValue: true,
      isHard: true
    });
  }

  // 7. GPS
  if (lower.includes('gps') || lower.includes('location')) {
    reqs.push({
      name: 'GPS Tracking',
      key: 'hasGPS',
      targetValue: true,
      isHard: false
    });
  }

  return reqs;
}

export function evaluateNumericRequirement(
  req: ParsedRequirement,
  spec: ProductSpecification
): { passes: boolean; actualValue?: string | number | boolean; reason: string } {
  const actual = spec[req.key];

  if (actual === undefined || actual === null) {
    return {
      passes: !req.isHard,
      actualValue: 'Not specified',
      reason: `Specification ${String(req.key)} is not explicitly declared.`
    };
  }

  // Boolean requirements
  if (typeof req.targetValue === 'boolean') {
    const passes = Boolean(actual) === req.targetValue;
    return {
      passes,
      actualValue: String(actual),
      reason: passes ? `Feature ${req.name} supported.` : `Feature ${req.name} not supported.`
    };
  }

  // Numeric minimum requirements
  if (typeof req.numericMin === 'number' && typeof actual === 'number') {
    const passes = actual >= req.numericMin;
    return {
      passes,
      actualValue: actual,
      reason: passes
        ? `Exceeds or meets minimum required value (${actual} >= ${req.numericMin}).`
        : `Fails minimum requirement (${actual} < ${req.numericMin}).`
    };
  }

  return {
    passes: true,
    actualValue: String(actual),
    reason: 'Requirement satisfied.'
  };
}
