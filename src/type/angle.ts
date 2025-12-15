
export class Angle {
    private _rad: number;

    private constructor(rad: number){
        this._rad = rad;
    }

    static rad(rad: number): Angle{
        return new Angle(rad);
    }

    static deg(deg: number): Angle{
        return new Angle(deg * (Math.PI/180));
    }

    get radians(): number {
        return this._rad;
    }

    get degrees(): number {
        return this._rad * (180/Math.PI);
    }

}