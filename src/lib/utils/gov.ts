export function getEmailDomain(email: string) {
  return email.split('@')[1]?.toLowerCase() ?? '';
}

export function isGovernmentEmail(email: string) {
  const d = getEmailDomain(email);
  if (!d) return false;

  // Common gov/mil + many countries' gov.xx patterns
  if (/\.(gov|mil)$/.test(d)) return true;                // e.g. city.gov, army.mil
  if (/\.gov\.[a-z]{2,}$/.test(d)) return true;           // e.g. gov.uk, gov.au
  if (/\.gouv\.[a-z]{2,}$/.test(d)) return true;          // e.g. gouv.fr
  if (/\.gc\.ca$/.test(d)) return true;                   // Canada federal
  if (/\.state\.[a-z]{2}\.us$/.test(d)) return true;      // e.g. something.state.ca.us
  if (/\.ci\.[a-z]{2}\.us$/.test(d)) return true;         // some US city subdomains

  return false;
}
