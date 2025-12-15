import type { Trail } from "./trail";
import type { Vec2 } from "../type/direction";
import { Direction } from "../type/direction";


export type Ant = {
    position: Vec2;
    direction: Direction;
    speed: number;
    followTrail: boolean;
}

export function spawnAnt(position: Vec2): Ant{
    let direction:number = Math.random() * 2 * Math.PI
    return {
        position: {...position},
        direction: Direction.fromRadians(direction),
        speed: 0.1,
        followTrail: direction > Math.PI
    };
}

export function followTrail(ant:Ant, trails:Trail[]): void{
    trails = trails.filter(trail => {
        return Math.hypot(trail.position.x - ant.position.x, trail.position.y - ant.position.y) < 10
    });

    if (trails.length < 1) {
        console.log("No trails within 10")
        let newAngle:number = getForwardishDirection(ant, 30);
        ant.direction = Direction.fromRadians(newAngle);
        return;
    } else if (trails.length > 1) {
        let antDirection:number = ant.direction.radians;
        trails.sort((a, b) => {
            let directionToA: number = Math.atan2(a.position.y - ant.position.y, a.position.x - ant.position.x);
            let directionToB: number = Math.atan2(b.position.y - ant.position.y, b.position.x - ant.position.x);
            let directionDiffToA: number = Math.atan2(Math.sin(directionToA - antDirection), Math.cos(directionToA - antDirection));
            let directionDiffToB: number = Math.atan2(Math.sin(directionToB - antDirection), Math.cos(directionToB - antDirection));
            return Math.abs(directionDiffToA) - Math.abs(directionDiffToB);
        })
    }

    let targetTrail: Trail = trails[0];
    let targetAngle: number = Math.atan2(targetTrail.position.y - ant.position.y, targetTrail.position.x - ant.position.x);
    ant.direction = Direction.fromRadians(targetAngle);

}

export function updateDirection(ant: Ant): void{
    let newDirection:number = getForwardishDirection(ant, 10);
    // let newDirection:number = getRandomDirection();
    ant.direction = Direction.fromRadians(newDirection);

}

function getForwardishDirection(ant:Ant, varianceDegrees:number){
    const directionVariance: number = varianceDegrees * Math.PI/180;
    let directionChange: number = Math.random() * (2 * directionVariance) - (directionVariance);
    return ant.direction.radians + directionChange;
}

function getRandomDirection(){
    return Math.random() * 2 * Math.PI;
}

export function step(ant: Ant, delta: number): void{
    const {x, y} = ant.direction.unit;
    ant.position.x += ant.speed * x * delta;
    ant.position.y += ant.speed * y * delta;

}