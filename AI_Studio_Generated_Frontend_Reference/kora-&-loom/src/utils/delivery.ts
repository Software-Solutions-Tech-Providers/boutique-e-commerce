export interface DeliveryEstimate {
  pincode: string;
  cityHint: string;
  windowLabel: string;
  codAvailable: boolean;
  dispatchNote: string;
}

export function estimateDeliveryByPincode(rawPin: string): DeliveryEstimate | null {
  const clean = rawPin.replace(/\D/g, '').slice(0, 6);
  if (clean.length !== 6) return null;

  const firstDigit = clean[0];
  let cityHint = 'Metro & Tier-1 Hub';
  let days = '2 to 4 business days';

  if (firstDigit === '6') {
    cityHint = 'South India · Chennai / Bengaluru / Kochi Cluster';
    days = '2 to 3 business days';
  } else if (firstDigit === '4') {
    cityHint = 'West India · Mumbai / Pune Hub';
    days = '2 to 4 business days';
  } else if (firstDigit === '1' || firstDigit === '2') {
    cityHint = 'North India · Delhi NCR / Varanasi Hub';
    days = '3 to 4 business days';
  } else if (firstDigit === '5') {
    cityHint = 'Hyderabad / Andhra Cluster';
    days = '2 to 4 business days';
  } else if (firstDigit === '7' || firstDigit === '8') {
    cityHint = 'East & North-East Hub';
    days = '4 to 5 business days';
  }

  return {
    pincode: clean,
    cityHint,
    windowLabel: `Arrives in ${days}`,
    codAvailable: true,
    dispatchNote: 'Insured handloom packaging · Dispatched within 24 hrs',
  };
}
