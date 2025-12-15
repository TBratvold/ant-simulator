export type Vec2 = {
    x: number;
    y: number;
}

const TAU = Math.PI * 2;

function wrapRad(rad: number): number{
    rad %= TAU;
    return rad < 0 ? rad + TAU : rad;
}

export class Direction {
    private _rad: number;
    private _unitCache: Vec2 | null = null;

    private constructor(rad: number){
        this._rad = wrapRad(rad);
    }

    static rad(rad: number): Direction{
        return new Direction(rad);
    }

    static deg(deg: number): Direction{
        return new Direction(deg * (Math.PI/180));
    }

    static unit(x:number, y:number): Direction{
        const len = Math.hypot(x, y);
        if (len === 0){
            return new Direction(0);
        }
        return new Direction(Math.atan2(y/len, x/len));
    }

    get radians(): number {
        return this._rad;
    }
    set radians(rad: number) {
        this._rad = wrapRad(rad);
        this._unitCache = null;
    }

    get degrees(): number {
        return this._rad * (180/Math.PI);
    }
    set degrees(deg: number) {
        this.radians = deg * (Math.PI/180);
    }

    get unit(): Vec2 {
        return (this._unitCache ??= {x: Math.cos(this._rad), y: Math.sin(this._rad)});
    }
}