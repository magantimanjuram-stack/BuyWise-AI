import { ComponentFitScores, ParsedRequirement, ProductRecord } from '../types/index.js';

import { calculatePurposeScore } from './purpose.js';
import { evaluateNumericRequirement } from './requirements.js';

export function calculateProductFit(
  product: ProductRecord,
  requirements: ParsedRequirement[],
  purposes: string[]
): { score: number; components: ComponentFitScores; hardRequirementPassed: boolean } {
  let reqMatchCount = 0;
  let hardFailCount = 0;

  for (const req of requirements) {
    const evalRes = evaluateNumericRequirement(req, product.specifications);
    if (evalRes.passes) {
      reqMatchCount++;
    } else if (req.isHard) {
      hardFailCount++;
    }
  }

  const hardRequirementPassed = hardFailCount === 0;

  // Purpose Score
  const purposeScore = calculatePurposeScore(purposes, product);

  // Component breakdowns
  const specs = product.specifications;
  const cpuStr = specs.cpu || specs.processor || 'Standard Processor';
  const ramStr = `${specs.ramGB || 'N/A'}GB RAM / ${specs.storageGB || 'N/A'}GB`;
  const batteryStr = `${specs.batteryHours || specs.batteryCapacitymAh || 'N/A'} Battery`;
  const displayStr = `${specs.resolution || specs.displaySizeInches || 'N/A'} (${specs.refreshRateHz || 60}Hz)`;

  const processorFit = (specs.ramGB && specs.ramGB >= 16) || cpuStr.includes('M3') || cpuStr.includes('Snapdragon 8') ? 'Excellent' : 'Strong';
  const ramStorageFit = (specs.ramGB && specs.ramGB >= 16) ? 'Strong' : 'Moderate';
  const batteryFit = (specs.batteryHours && specs.batteryHours >= 15) || (specs.batteryCapacitymAh && specs.batteryCapacitymAh >= 5000) ? 'Strong' : 'Moderate';
  const displayFit = (specs.refreshRateHz && specs.refreshRateHz >= 120) || (specs.resolution && specs.resolution.includes('OLED')) ? 'Excellent' : 'Strong';
  const purposeFit = purposeScore >= 90 ? 'Excellent' : purposeScore >= 75 ? 'Strong' : 'Moderate';

  // Base raw fit score
  let baseFit = 85;
  if (requirements.length > 0) {
    const reqRatio = reqMatchCount / requirements.length;
    baseFit = Math.round(reqRatio * 40 + (purposeScore / 100) * 60);
  } else {
    baseFit = purposeScore;
  }

  // Severe penalty for failing hard requirements
  if (!hardRequirementPassed) {
    baseFit = Math.min(baseFit, 35 - hardFailCount * 15);
    baseFit = Math.max(baseFit, 10);
  }

  const overallFitScore = Math.min(100, Math.max(0, baseFit));

  return {
    score: overallFitScore,
    components: {
      processorFit: `${processorFit} (${cpuStr})`,
      ramStorageFit: `${ramStorageFit} (${ramStr})`,
      batteryFit: `${batteryFit} (${batteryStr})`,
      displayFit: `${displayFit} (${displayStr})`,
      purposeFit: `${purposeFit} (${purposeScore}/100)`,
      overallFitScore
    },
    hardRequirementPassed
  };
}
