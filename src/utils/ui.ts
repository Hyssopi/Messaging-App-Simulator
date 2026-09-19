export function getDomElement<T extends HTMLElement>(id: string, required?: true): T;

export function getDomElement<T extends HTMLElement>(id: string, required: false): T | null;

export function getDomElement<T extends HTMLElement>(id: string, required = true): T | null {
  const element = document.getElementById(id);

  if (element === null) {
    if (required) {
      throw new Error(`Element with ID "#${id}" not found`);
    }

    return null;
  }

  return element as T;
}

export function queryDom<T extends Element>(parent: ParentNode, selector: string, required?: true): T;

export function queryDom<T extends Element>(parent: ParentNode, selector: string, required: false): T | null;

export function queryDom<T extends Element>(parent: ParentNode, selector: string, required = true): T | null {
  const element = parent.querySelector<T>(selector);

  if (element === null) {
    if (required) {
      throw new Error(`Element not found for selector: "${selector}"`);
    }

    return null;
  }

  return element;
}

export function queryAll<T extends Element>(selector: string): NodeListOf<T> {
  return document.querySelectorAll<T>(selector);
}
