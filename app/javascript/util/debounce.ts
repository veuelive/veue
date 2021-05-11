export function throttle(delay = 1000): MethodDecorator {
  let timeout;
  return (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const method = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      if (!timeout) {
        method.apply(this, args);
        timeout = setTimeout(() => {
          timeout = null;
        }, delay);
      }
    };
  };
}

export function debounce(delay = 1000): MethodDecorator {
  let timeout;
  return (
    target: unknown,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) => {
    const method = descriptor.value;
    descriptor.value = function (...args: unknown[]) {
      if (timeout) {
        window.clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        method.apply(this, args);
        timeout = null;
      }, delay);
    };
  };
}
