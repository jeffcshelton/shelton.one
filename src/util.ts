/**
 * Combines multiple style class strings into one, ignoring undefined ones.
 *
 * @param classes - All style class strings to combine into one.
 */
export function addClass(...classes: (string | undefined)[]) {
  let all = "";

  for (const style of classes) {
    if (style) {
      if (all.length > 0) {
        all += " ";
      }

      all += style;
    }
  }

  return all;
}
