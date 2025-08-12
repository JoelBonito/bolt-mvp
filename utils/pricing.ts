export type EstimateInput = { teethCount: number; unitPrice: number; clinicFee?: number; discount?: number };
export function estimatePrice(input: EstimateInput) {
  const { teethCount, unitPrice, clinicFee = 0, discount = 0 } = input;
  const subtotal = teethCount * unitPrice + clinicFee;
  const total = Math.max(0, subtotal - discount);
  return { subtotal, total, currency: "BRL" as const };
}
