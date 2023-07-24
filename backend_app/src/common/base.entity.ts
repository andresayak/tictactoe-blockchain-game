import { classToPlain } from "class-transformer";
import { DeepPartial } from "typeorm";

export class BaseEntity<T> {
  constructor(partial: DeepPartial<T>) {
    this.fill(partial);
  }

  fill(partial: DeepPartial<T>) {
    Object.assign(this, partial);
    return this;
  }

  toJSON() {
    return classToPlain(this);
  }
}
