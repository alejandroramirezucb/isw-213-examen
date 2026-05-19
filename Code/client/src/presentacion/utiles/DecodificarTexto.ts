export function decodificarTexto(texto: string | null | undefined): string {
  if (!texto) {
    return '';
  }
  try {
    const bytes = new Uint8Array(
      texto.split('').map((caracter) => caracter.charCodeAt(0) & 0xff),
    );
    return new TextDecoder('utf-8').decode(bytes);
  } catch {
    return texto;
  }
}
