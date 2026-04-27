/**
 * Shared validation helpers for the HealthConnect frontend.
 * Use these across all forms to ensure consistent validation behaviour.
 */

// ─── Regex Patterns ──────────────────────────────────────────────

export const PATTERNS = {
  digitsOnly: /^\d+$/,
  phone: /^\d{10,15}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  zipCode: /^[a-zA-Z0-9\s\-]{3,10}$/,
  cardNumber: /^\d{13,19}$/,
  expiry: /^(0[1-9]|1[0-2])\/\d{2}$/,
  cvv: /^\d{3,4}$/,
  lettersAndSpaces: /^[a-zA-Z\s.]+$/,
};

// ─── Field Validators ────────────────────────────────────────────

export const isValidPhone = (v) => !v || PATTERNS.phone.test(v.replace(/[\s\-()]/g, ''));
export const isValidEmail = (v) => !v || PATTERNS.email.test(v);
export const isValidZipCode = (v) => !v || PATTERNS.zipCode.test(v);

export const isValidCardNumber = (v) => {
  const digits = v.replace(/\s/g, '');
  return PATTERNS.cardNumber.test(digits);
};

export const isValidExpiry = (v) => {
  if (!PATTERNS.expiry.test(v)) return false;
  const [mm, yy] = v.split('/').map(Number);
  const now = new Date();
  const expYear = 2000 + yy;
  const expMonth = mm;
  return (expYear > now.getFullYear()) ||
    (expYear === now.getFullYear() && expMonth >= now.getMonth() + 1);
};

export const isValidCVV = (v) => PATTERNS.cvv.test(v);

// ─── Input Formatters ────────────────────────────────────────────

/** Allow only digits in an input. Use as onChange handler wrapper. */
export const digitsOnly = (value) => value.replace(/\D/g, '');

/** Format a card number string with spaces every 4 digits. */
export const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

/** Format an expiry date string as MM/YY. */
export const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) {
    return digits.slice(0, 2) + '/' + digits.slice(2);
  }
  return digits;
};

// ─── Error Message Generators ────────────────────────────────────

export const required = (label) => `${label} is required`;
export const minLength = (label, n) => `${label} must be at least ${n} characters`;
export const maxLength = (label, n) => `${label} must not exceed ${n} characters`;
export const invalidFormat = (label) => `Please enter a valid ${label.toLowerCase()}`;
