/** Shape check for ?u=<username>&t=<token> links issued by the server worker. */
export const isValidLink = (username, token) =>
  /^[A-Za-z0-9]{3,20}$/.test(username ?? '') && /^[A-Za-z0-9_-]{16,256}$/.test(token ?? '')
