export enum CarType {
  Sedan = 'Sedan',
  Suv = 'SUV',
  Van = 'Van',
}

export class Car {
  constructor(
    public readonly id: string,
    public readonly type: CarType,
  ) {}
}

