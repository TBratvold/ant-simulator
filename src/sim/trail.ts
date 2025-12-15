import type { Vec2 } from "../type/direction";

export type Trail = {
    position: Vec2;
    age: number;
    maxAge: number;
}

export function spawnTrail(position: Vec2): Trail{
    return {
        position: {...position},
        age: 0,
        maxAge: 500
    };
}