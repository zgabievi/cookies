import { CookiesOptions } from './cookies-options';

export function isBlank(obj: any): boolean {
  return obj === undefined || obj === null;
}

export function isPresent(obj: any): boolean {
  return obj !== undefined && obj !== null;
}

export function isString(obj: any): obj is string {
  return typeof obj === 'string';
}

export function mergeOptions(oldOptions: CookiesOptions, newOptions?: CookiesOptions): CookiesOptions {
  if (!newOptions) {
    return oldOptions;
  }
  return {
    path: isPresent(newOptions.path) ? newOptions.path : oldOptions.path,
    domain: isPresent(newOptions.domain) ? newOptions.domain : oldOptions.domain,
    expires: isPresent(newOptions.expires) ? newOptions.expires : oldOptions.expires,
    secure: isPresent(newOptions.secure) ? newOptions.secure : oldOptions.secure,
    httpOnly: isPresent(newOptions.httpOnly) ? newOptions.httpOnly : oldOptions.httpOnly
  };
}

export function safeDecodeURIComponent(str: string): string {
  try {
    return decodeURIComponent(str);
  } catch (e) {
    return str;
  }
}

export function safeJsonParse(str: string): { [key: string]: any } | string {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

export function serializer(
  replacer: Function = null,
  cycleReplacer: Function = null
): any {
  const stack = [];
  const keys = [];

  if (cycleReplacer == null) {
    cycleReplacer = function(_, value: any) {
      if (stack[0] === value) {
        return '[Circular ~]';
      }

      return (
        '[Circular ~.' + keys.slice(0, stack.indexOf(value)).join('.') + ']'
      );
    };
  }

  return function(key: string, value: any) {
    if (stack.length > 0) {
      const thisPos = stack.indexOf(this);
      ~thisPos ? stack.splice(thisPos + 1) : stack.push(this);
      ~thisPos ? keys.splice(thisPos, Infinity, key) : keys.push(key);
      if (~stack.indexOf(value)) {
        value = cycleReplacer.call(this, key, value);
      }
    } else {
      stack.push(value);
    }

    return replacer == null ? value : replacer.call(this, key, value);
  };
}

export function safeJsonStringify(
  obj: any,
  replacer: Function = null,
  spaces?: number,
  cycleReplacer: Function = null
): string {
  return JSON.stringify(obj, serializer(replacer, cycleReplacer), spaces);
}
