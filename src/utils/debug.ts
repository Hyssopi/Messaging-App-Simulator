// TODO: This doesn't work with Set. Remove in the future.
export function consoleLogColor(value: unknown): void {
  const json = JSON.stringify(value, null, 2);

  if (json === undefined) {
    console.log(value);
    return;
  }

  const styles: string[] = [];

  const coloredJson = json.replace(
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(?=\s*:)|"(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"|\b(?:true|false|null)\b|-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let style = 'color: #b5cea8;';

      if (match.startsWith('"')) {
        style = match.endsWith(':') ? 'color: #9cdcfe;' : 'color: #ce9178;';
      } else if (match === 'true' || match === 'false' || match === 'null') {
        style = 'color: #569cd6;';
      }

      styles.push(style, 'color: inherit;');

      return `%c${match}%c`;
    },
  );

  console.log(coloredJson, ...styles);
}
