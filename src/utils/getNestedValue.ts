export const getNestedValue = (
  obj: Record<string, unknown>,
  path: string
): unknown => {
  return path
    .split(".")
    .reduce<unknown>((current, key) => {
      if (
        current !== null &&
        typeof current === "object" &&
        key in current
      ) {
        return (current as Record<string, unknown>)[key];
      }

      return undefined;
    }, obj);
};