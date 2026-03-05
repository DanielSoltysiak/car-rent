"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Car = exports.CarType = void 0;
var CarType;
(function (CarType) {
    CarType["Sedan"] = "Sedan";
    CarType["Suv"] = "SUV";
    CarType["Van"] = "Van";
})(CarType || (exports.CarType = CarType = {}));
class Car {
    id;
    type;
    constructor(id, type) {
        this.id = id;
        this.type = type;
    }
}
exports.Car = Car;
//# sourceMappingURL=car.js.map