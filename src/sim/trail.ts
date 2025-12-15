export type Trail = {
    position: {x:number, y:number};
    age: number;
    maxAge: number;
}

export function spawnTrail(x:number, y:number): Trail{
    return {
        position: {x:x, y:y},
        age: 0,
        maxAge: 500
    };
}