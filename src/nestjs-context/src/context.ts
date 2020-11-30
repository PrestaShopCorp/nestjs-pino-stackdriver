// inheritance allows us to change the father
// of the context class without touching its
// uses in our code
const objectToString = (obj: object) => {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return obj.toString();
  }
};

export class Context extends Map {
  // do not remove this call as we want an
  // explicit call to the empty constructor
  constructor() {
    super();
  }

  delete(key: any, callback: (value: any) => void = () => {}) {
    const value = this.get(key);
    const ret = super.delete(key);
    callback(value);
    return ret;
  }

  get [Symbol.toStringTag]() {
    const arr = [];
    for (const [key, value] of this) {
      arr.push(
        `[${key.toString()}]: <${typeof value}>${
          typeof value === 'object' ? objectToString(value) : value.toString()
        }`,
      );
    }
    return `{ ${arr.join(', ')} }`;
  }
}

// we've created a Proxy Class to quick-fix an access bug
// in the standard Map in some cases (within the DI)
// so context['my-string'] does not always work
export const createContext = () => {
  const context = new Context();
  return new Proxy(context, {
    get: (target: Context, prop: any, receiver) => {
      if (prop in target) {
        return (target as any)[prop].bind(target);
      }

      return target.get(prop);
    },
    set: (target: Context, prop: any, value: any) => {
      target.set(prop, value);
      return !!target.get(prop);
    },
    has: (target: Context, key: any) => {
      return target.has(key);
    },
    deleteProperty: (target: Context, key: any) => {
      if (target.has(key)) {
        target.delete(key);
        return !target.has(key);
      }
      return false;
    },
  });
};
