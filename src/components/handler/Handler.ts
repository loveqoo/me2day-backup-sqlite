import { ResourceHandler } from "../define/base";
import { injectable, unmanaged } from "inversify";
import "reflect-metadata";

const callOnce = function <A>(f: () => A) {
  let called: boolean = false;
  let result: A;
  return () => {
    if (called) {
      return result;
    } else {
      result = f();
      called = true;
      return result;
    }
  }
};

@injectable()
export default class DefaultResourceHandler<T> implements ResourceHandler<T> {

  private readonly supplier: () => T;
  private readonly closer: () => void;

  constructor(@unmanaged() supplier: () => T, @unmanaged() closer: () => void) {
    this.supplier = callOnce(supplier);
    this.closer = callOnce(closer);
  }

  async getResource(): Promise<T> {
    return this.supplier();
  }

  async close(): Promise<void> {
    return this.closer();
  }
}