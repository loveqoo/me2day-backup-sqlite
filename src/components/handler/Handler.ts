import { Environment, ResourceHandler } from "../defines";
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

  getResource(option?: Environment): T {
    return this.supplier();
  }

  close(): void {
    return this.closer();
  }
}