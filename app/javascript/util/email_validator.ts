export default function isValidEmail(email: string): boolean {
  const emailRegex = /([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})/;
  return emailRegex.test(email);
}
