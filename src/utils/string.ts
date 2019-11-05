export function parseQueryParam(query: string): Record<string, string> {
  return (query.match(/[^?&]+/g) || [])
    .map((str): string[] => str.match(/[^=]+/g) || [])
    .reduce(
      (acc, [key, value]: string[]): Record<string, string> => ({
        ...acc,
        [key]: value
      }),
      {}
    );
}
