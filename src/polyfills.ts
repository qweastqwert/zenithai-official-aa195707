// Polyfills for older browsers and WebViews
import 'core-js/stable';

// Polyfill for globalThis
if (typeof globalThis === 'undefined') {
  (window as any).globalThis = window;
}

// Polyfill for Array.prototype.at
if (!Array.prototype.at) {
  Array.prototype.at = function(index: number) {
    const len = this.length;
    const relativeIndex = index < 0 ? len + index : index;
    return relativeIndex >= 0 && relativeIndex < len ? this[relativeIndex] : undefined;
  };
}

// Polyfill for String.prototype.at
if (!String.prototype.at) {
  String.prototype.at = function(index: number) {
    const len = this.length;
    const relativeIndex = index < 0 ? len + index : index;
    return relativeIndex >= 0 && relativeIndex < len ? this.charAt(relativeIndex) : undefined;
  };
}

// Polyfill for String.prototype.replaceAll
if (!(String.prototype as any).replaceAll) {
  (String.prototype as any).replaceAll = function(search: string | RegExp, replacement: string) {
    if (search instanceof RegExp) {
      if (!search.global) {
        throw new TypeError('replaceAll must be called with a global RegExp');
      }
      return this.replace(search, replacement);
    }
    return this.split(search).join(replacement);
  };
}

// Polyfill for Object.fromEntries
if (!Object.fromEntries) {
  Object.fromEntries = function<T = any>(entries: Iterable<readonly [PropertyKey, T]>): { [k: string]: T } {
    const obj: { [k: string]: T } = {};
    for (const [key, value] of entries) {
      obj[key as string] = value;
    }
    return obj;
  };
}

// Polyfill for Promise.allSettled
if (!Promise.allSettled) {
  Promise.allSettled = function<T>(promises: Iterable<T | PromiseLike<T>>): Promise<PromiseSettledResult<Awaited<T>>[]> {
    return Promise.all(
      Array.from(promises).map((p) =>
        Promise.resolve(p)
          .then((value) => ({ status: 'fulfilled' as const, value }))
          .catch((reason) => ({ status: 'rejected' as const, reason }))
      )
    );
  };
}

// Polyfill for Element.prototype.replaceChildren
if (!Element.prototype.replaceChildren) {
  Element.prototype.replaceChildren = function(...nodes: (Node | string)[]) {
    while (this.lastChild) {
      this.removeChild(this.lastChild);
    }
    this.append(...nodes);
  };
}

// Polyfill for queueMicrotask
if (typeof queueMicrotask !== 'function') {
  (window as any).queueMicrotask = function(callback: () => void) {
    Promise.resolve().then(callback).catch((e) => setTimeout(() => { throw e; }, 0));
  };
}

// Polyfill for AbortController if not available
if (typeof AbortController === 'undefined') {
  (window as any).AbortController = class AbortController {
    signal = { aborted: false, addEventListener: () => {}, removeEventListener: () => {} };
    abort() { (this.signal as any).aborted = true; }
  };
}

// Polyfill for structuredClone
if (typeof structuredClone === 'undefined') {
  (window as any).structuredClone = function(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  };
}

export {};
