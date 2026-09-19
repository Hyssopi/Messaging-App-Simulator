export function formatSignedNumber(input: number): string {
  if (input > 0) {
    return `+${input}`;
  } else if (input < 0) {
    return `${input}`;
  }
  return '0';
}

export function kebabToTitleCase(input: string): string {
  return input
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function isMobile(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

export function isImageMedia(src: string): boolean {
  const srcPath = src.split('?')[0] ?? '';
  return /\.(?:jpg|jpeg|png|gif|webp)$/i.test(srcPath);
}
