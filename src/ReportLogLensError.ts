/** Report internal failures without routing them back through LogLens. */
export function reportLogLensError(message: string, error?: unknown): void {
  try {
    if (error === undefined) {
      console.error('[LogLens]', message);
    } else {
      console.error('[LogLens]', message, error);
    }
  } catch {
    // Logging infrastructure must never interrupt the host application.
  }
}
