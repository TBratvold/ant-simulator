import type { Vec2 } from "../type/direction";
import { Direction } from "../type/direction";
import { Angle } from "../type/angle";

export function directionTo(fromPosition:Vec2, toPosition:Vec2): Direction{
    let angle: number = Math.atan2(toPosition.y - fromPosition.y, toPosition.x - fromPosition.x);
    return Direction.rad(angle);
}

export function signedAngularDifference(current:Direction, target:Direction): Angle {
    const d = target.radians - current.radians;
    return Angle.rad(Math.atan2(Math.sin(d), Math.cos(d)));
}

export function absoluteDistanceBetween(a:Vec2, b:Vec2): number {
    return Math.hypot(a.x-b.x, a.y-b.y);
}

export function applyVariance(direction:Direction, variance:Angle): Direction {
    const varianceRad: number = (Math.random() * variance.radians * 2) - variance.radians;
    return Direction.rad(direction.radians + varianceRad);
}