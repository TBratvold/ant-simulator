import type { Trail } from "./trail";
import type { Vec2 } from "../type/direction";
import { Direction } from "../type/direction";
import { Angle } from "../type/angle";
import { absoluteDistanceBetween, applyVariance, directionTo, signedAngularDifference } from "../util/math";


export type Ant = {
    position: Vec2;
    direction: Direction;
    speed: number;
    followTrail: boolean;
    visionRange: number;
}

export function spawnAnt(position: Vec2): Ant{
    let direction:number = Math.random() * 2 * Math.PI
    return {
        position: {...position},
        direction: Direction.rad(direction),
        speed: 0.1,
        followTrail: direction > Math.PI,
        visionRange: 10
    };
}

export function followTrail(ant:Ant, trails:Trail[]): void{
    trails = trails.filter(trail => {
        return absoluteDistanceBetween(trail.position, ant.position) < ant.visionRange;
    });

    if (trails.length < 1) {
        ant.direction = applyVariance(ant.direction, Angle.deg(30));
        return;
    } else if (trails.length > 1) {
        trails.sort((a, b) => {
            let directionToA: Direction = directionTo(ant.position, a.position);
            let directionToB: Direction = directionTo(ant.position, b.position);
            let directionDiffToA: Angle = signedAngularDifference(ant.direction, directionToA);
            let directionDiffToB: Angle = signedAngularDifference(ant.direction, directionToB);
            return Math.abs(directionDiffToA.radians) - Math.abs(directionDiffToB.radians);
        })
    }

    let targetTrail: Trail = trails[0];
    let targetDirection: Direction = directionTo(ant.position, targetTrail.position);
    ant.direction = applyVariance(targetDirection, Angle.deg(10));

}

export function updateDirection(ant: Ant): void{
    ant.direction = applyVariance(ant.direction, Angle.deg(10))
}

export function step(ant: Ant, delta: number): void{
    const {x, y} = ant.direction.unit;
    ant.position.x += ant.speed * x * delta;
    ant.position.y += ant.speed * y * delta;

}