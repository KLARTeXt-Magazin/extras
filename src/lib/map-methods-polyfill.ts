// =======================================================
// KLEINER KOMPATIBILITÄTS-PATCH
// • Map.getOrInsert / getOrInsertComputed sind Teil eines
//   ganz neuen JavaScript-Standards; ältere Browser (und
//   damit z. B. ältere iPhones) kennen sie noch nicht.
// • pdf.js nutzt beide Methoden beim Anzeigen von PDFs –
//   daher hier die beiden Zeilen Ergänzung.
// =======================================================

declare global {
  interface Map<K, V> {
    getOrInsert(key: K, value: V): V;
    getOrInsertComputed(key: K, callback: (key: K) => V): V;
  }
}

if (typeof Map !== "undefined" && !Map.prototype.getOrInsertComputed) {
  Map.prototype.getOrInsert = function (key, value) {
    if (!this.has(key)) this.set(key, value);
    return this.get(key) as never;
  };

  Map.prototype.getOrInsertComputed = function (key, callback) {
    if (!this.has(key)) this.set(key, callback(key));
    return this.get(key) as never;
  };
}

export {};
