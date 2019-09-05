function getDomain(host: string) {
  const parts = host.split(".");
  if (parts.length === 1) {
    return parts[0];
  }
  if (parts.length === 2) {
    if (host.includes("localhost")) {
      return parts[1];
    }
    return host;
  }
  if (parts.length === 3) {
    return `${parts[1]}.${parts[2]}`;
  }
}
export function parseHost(host: string) {
  const domain = getDomain(host);
  const subdomain = host.replace(domain, "").replace(".", "");
  return { domain, subdomain };
}
