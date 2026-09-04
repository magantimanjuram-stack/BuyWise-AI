import { ProductRecord } from '../types/index.js';

export function calculatePurposeScore(purposes: string[], product: ProductRecord): number {
  if (!purposes || purposes.length === 0) return 85; // Default score if no specific purpose selected

  let totalScore = 0;

  for (const purpose of purposes) {
    const p = purpose.toLowerCase();
    let subScore = 75; // baseline

    const specs = product.specifications;

    if (p.includes('coding') || p.includes('ai development') || p.includes('work') || p.includes('study')) {
      if (product.category === 'laptop') {
        const ram = specs.ramGB || 8;
        const cpu = specs.cpu || specs.processor || '';
        if (ram >= 16 && (cpu.includes('M3') || cpu.includes('Ryzen 7') || cpu.includes('Ryzen 9') || cpu.includes('Ultra 5') || cpu.includes('i7'))) {
          subScore = 98;
        } else if (ram >= 16) {
          subScore = 90;
        } else {
          subScore = 45; // 8GB RAM is severely penalized for Coding / AI Dev
        }
      } else if (product.category === 'smartphone') {
        if ((specs.ramGB || 0) >= 12) subScore = 95;
        else if ((specs.ramGB || 0) >= 8) subScore = 85;
      } else {
        subScore = 80;
      }
    } else if (p.includes('gaming')) {
      if (product.category === 'laptop') {
        const gpu = specs.gpu || '';
        const hz = specs.refreshRateHz || 60;
        if (gpu.includes('4060') || gpu.includes('4070') || gpu.includes('4080')) {
          subScore = hz >= 144 ? 98 : 90;
        } else if (gpu.includes('2050') || gpu.includes('3050')) {
          subScore = 65;
        } else {
          subScore = 40; // Integrated GPU penalized for gaming
        }
      } else if (product.category === 'tv') {
        subScore = (specs.refreshRateHz || 60) >= 120 ? 98 : 60;
      } else if (product.category === 'smartphone') {
        subScore = (specs.refreshRateHz || 60) >= 120 ? 92 : 65;
      }
    } else if (p.includes('photography') || p.includes('content creation')) {
      if (product.category === 'smartphone') {
        if (product.brand === 'Apple' || product.brand === 'Samsung' || (specs.cameraMP || 0) >= 50) {
          subScore = 95;
        } else {
          subScore = 75;
        }
      } else if (product.category === 'laptop') {
        const res = specs.resolution || '';
        subScore = (res.includes('OLED') || res.includes('Liquid Retina') || res.includes('3K') || res.includes('2.8K')) ? 96 : 70;
      }
    } else if (p.includes('movies') || p.includes('entertainment')) {
      if (product.category === 'tv') {
        const panel = specs.panelType || '';
        if (panel.includes('OLED')) subScore = 99;
        else if (panel.includes('Mini-LED') || panel.includes('QLED')) subScore = 92;
        else subScore = 75;
      } else if (product.category === 'laptop') {
        subScore = (specs.resolution || '').includes('OLED') ? 95 : 80;
      }
    } else if (p.includes('music') || p.includes('calls')) {
      if (product.category === 'headphones' || product.category === 'earbuds') {
        const mic = specs.micQuality || '';
        const anc = specs.hasANC;
        if (anc && (mic.includes('AI') || mic.includes('beamforming') || mic.includes('V1') || mic.includes('H2'))) {
          subScore = 98;
        } else if (anc) {
          subScore = 88;
        } else {
          subScore = 65;
        }
      }
    } else if (p.includes('fitness') || p.includes('travel')) {
      if (product.category === 'smartwatch') {
        const batteryHrs = specs.batteryHours || 24;
        const gps = specs.hasGPS;
        if (gps && batteryHrs >= 48) subScore = 98;
        else if (gps) subScore = 90;
        else subScore = 60;
      } else if (product.category === 'earbuds') {
        subScore = specs.waterResistance ? 95 : 75;
      } else if (product.category === 'headphones') {
        subScore = (specs.batteryHours || 0) >= 30 ? 95 : 80;
      }
    } else if (p.includes('battery life')) {
      const hrs = specs.batteryHours || 0;
      const mah = specs.batteryCapacitymAh || 0;
      if (hrs >= 20 || mah >= 5000) subScore = 98;
      else if (hrs >= 12 || mah >= 4000) subScore = 85;
      else subScore = 60;
    }

    totalScore += subScore;
  }

  return Math.round(totalScore / purposes.length);
}
