import type { Vec2 } from "../type/direction";
import type { Ant } from "./ant";

export type Wall = {
    topLeft: Vec2;
    bottomRight: Vec2;
}

export function antInWall(ant:Ant, wall:Wall): boolean {
    return (
        ant.position.x >= wall.topLeft.x 
        && ant.position.x <= wall.bottomRight.x
        && ant.position.y >= wall.topLeft.y 
        && ant.position.y <= wall.bottomRight.y
    );
}