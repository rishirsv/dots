/**
 * The one escaping owner for dots HTML output.
 *
 * `html` and `svg` tagged templates escape every interpolated value unless it
 * is already SafeHtml. Arrays render each item; null, undefined, and false
 * render nothing. `raw()` is the explicit opt-out for trusted markup.
 */

const ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

export const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (char) => ESCAPES[char]);

/** Insert text literally; String.replace otherwise expands $&, $', and $` in its replacement. */
export function replaceLiteral(source, search, value) {
  return typeof search === 'string' ? source.replaceAll(search, () => value) : source.replace(search, () => value);
}

export class SafeHtml {
  constructor(markup, kind = "") {
    this.__html = markup;
    this.kind = kind;
    Object.freeze(this);
  }

  toString() {
    return this.__html;
  }
}

export function render(value) {
  if (value == null || value === false) return "";
  if (value instanceof SafeHtml) return value.__html;
  if (Array.isArray(value)) return value.map(render).join("");
  return escapeHtml(value);
}

export function html(strings, ...values) {
  let markup = strings[0];
  values.forEach((value, index) => { markup += render(value) + strings[index + 1]; });
  return new SafeHtml(markup);
}

export const svg = html;

export const raw = (markup) => new SafeHtml(String(markup));

/** Mark rendered markup with a helper kind so a parent helper can validate its children. */
export const tagged = (kind, value) => new SafeHtml(render(value), kind);
