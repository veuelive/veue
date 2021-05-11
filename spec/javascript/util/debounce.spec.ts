import { throttle } from "../../../app/javascript/util/debounce";

describe(debounce, () => {
  const LONG_TIMEOUT = 50000;

  let counter;

  class Counter {
    count = 0;

    increment() {
      this.count++;
    }

    // Default 1 second debounce
    @throttle()
    debouncedIncrement() {
      this.increment();
    }

    // Set custom debounce
    @throttle(LONG_TIMEOUT)
    longDebounceIncrement() {
      this.increment();
    }
  }

  beforeEach(() => {
    // We have to call this before each run to clear assertions
    jest.useFakeTimers();
    // Setup the class above for the tests
    counter = new Counter();
  });

  it("should function normally without debounce", () => {
    counter.increment();
    counter.increment();
    counter.increment();
    expect(counter.count).toEqual(3);
  });

  it("debounce should stop multiple calls", () => {
    counter.debouncedIncrement();
    counter.debouncedIncrement();
    counter.debouncedIncrement();
    expect(counter.count).toEqual(1);
  });

  it("should trigger after the delay", () => {
    counter.longDebounceIncrement();
    counter.longDebounceIncrement();
    counter.longDebounceIncrement();
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      LONG_TIMEOUT
    );
    expect(counter.count).toEqual(1);
    jest.runAllTimers();
    expect(counter.count).toEqual(1);
    counter.longDebounceIncrement();
    counter.longDebounceIncrement();
    counter.longDebounceIncrement();
    expect(counter.count).toEqual(2);
  });
});
