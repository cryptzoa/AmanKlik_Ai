const EMAIL_PATTERN = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const INDONESIAN_PHONE_PATTERN = /(?<!\d)(?:\+?62|0)[ -]?8(?:[ -]?\d){7,12}(?!\d)/g;
const LONG_NUMBER_PATTERN = /(?<!\d)(?:\d[ -]?){9,19}\d(?!\d)/g;
const OTP_CONTEXT_PATTERN = /((?:otp|kode(?:\s+verifikasi)?|verifikasi)[^\d]{0,24})(\d(?:[ -]?\d){3,7})/gi;

function maskMiddle(value: string, visibleStart = 2, visibleEnd = 2): string {
  if (value.length <= visibleStart + visibleEnd) return "•••";
  return `${value.slice(0, visibleStart)}•••${value.slice(-visibleEnd)}`;
}

function maskDigitSequence(value: string, visibleStart: number, visibleEnd: number): string {
  const digitCount = [...value].filter((character) => /\d/.test(character)).length;
  let digitIndex = 0;
  return [...value].map((character) => {
    if (!/\d/.test(character)) return character;
    const visible = digitIndex < visibleStart || digitIndex >= digitCount - visibleEnd;
    digitIndex += 1;
    return visible ? character : "•";
  }).join("");
}

export function redactText(input: string): string {
  let result = input.replace(EMAIL_PATTERN, (email) => {
    const [local, domain] = email.split("@");
    return `${maskMiddle(local, 1, 1)}@${domain}`;
  });

  result = result.replace(INDONESIAN_PHONE_PATTERN, (phone) => maskDigitSequence(phone, 3, 2));
  result = result.replace(LONG_NUMBER_PATTERN, (number) => maskDigitSequence(number, 2, 2));
  result = result.replace(OTP_CONTEXT_PATTERN, (_match, prefix: string, code: string) => {
    return `${prefix}${maskDigitSequence(code, 0, 1)}`;
  });

  return result;
}

export function redactEvidence(input: string, maxLength = 120): string {
  const redacted = redactText(input).trim();
  return redacted.length > maxLength ? `${redacted.slice(0, maxLength - 1)}…` : redacted;
}
