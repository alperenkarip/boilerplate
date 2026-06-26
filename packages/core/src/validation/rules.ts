// Validation utility fonksiyonlari — saf fonksiyonlar, side-effect yok
// @MX:TODO: [AUTO] No test file — 7 validation functions (isEmail, isPhoneNumber, isStrongPassword, isURL, isEmpty, minLength, maxLength) are untested

/** E-posta adresi gecerlilik kontrolu */
export function isEmail(value: string): boolean {
  // RFC 5322 basitlestirilmis regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(value);
}

/** Telefon numarasi gecerlilik kontrolu (uluslararasi format destekli) */
export function isPhoneNumber(value: string): boolean {
  // Uluslararasi format: +XX ile baslayabilir, 7-15 rakam
  const phoneRegex = /^\+?[0-9]{7,15}$/;
  return phoneRegex.test(value.replace(/[\s\-()]/g, ''));
}

/**
 * Guclu sifre kontrolu.
 * Gereksinimler: en az 8 karakter, buyuk harf, kucuk harf, rakam
 */
export function isStrongPassword(value: string): boolean {
  if (value.length < 8) return false;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasNumber = /[0-9]/.test(value);

  return hasUpperCase && hasLowerCase && hasNumber;
}

/** URL gecerlilik kontrolu */
export function isURL(value: string): boolean {
  try {
    // React Native'in URL tipi `.protocol` ozelligini tanimlamaz (lib: ES2022,
    // DOM yok) ama polyfill calisma zamaninda saglar. Bu paketi DOM-free tutmak
    // icin protocol'e tip-guvenli sekilde erisiyoruz; davranis degismez.
    const { protocol } = new URL(value) as { protocol?: string };
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
}

/** Bos deger kontrolu — null, undefined, bos string, bos dizi, bos obje */
export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/** Minimum uzunluk kontrolu */
export function minLength(value: string, min: number): boolean {
  return value.length >= min;
}

/** Maksimum uzunluk kontrolu */
export function maxLength(value: string, max: number): boolean {
  return value.length <= max;
}
