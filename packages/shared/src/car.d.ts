export declare enum CarType {
    Sedan = "Sedan",
    Suv = "SUV",
    Van = "Van"
}
export declare class Car {
    readonly id: string;
    readonly type: CarType;
    constructor(id: string, type: CarType);
}
