/**
 * throwing this in request handler indicates requests problem (not server)
 */
export class ClientError extends Error {
  constructor(message: string) {
    super(message);
  }
}
