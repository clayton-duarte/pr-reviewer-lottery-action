export function formatMessage(obj: unknown, message = '>>>'): string {
  return `${message}> ${JSON.stringify(obj, null, 2)}`
}
