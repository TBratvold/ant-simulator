import type { Trail } from "./trail";


export type Ant = {
    position: {x: number, y: number};
    direction: {x: number, y: number};
    speed: number;
    followTrail: boolean;
}

export function spawnAnt(x:number, y:number): Ant{
    let direction:number = Math.random() * 2 * Math.PI
    return {
        position: {x: x, y: y},
        direction: {x: Math.cos(direction), y: Math.sin(direction)},
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
        ant.direction = {x: Math.cos(newAngle), y: Math.sin(newAngle)};
        return;
    } else if (trails.length > 1) {
        let antDirection = Math.atan2(ant.direction.y, ant.direction.x);
        trails.sort((a, b) => {
            let directionToA: number = Math.atan2(a.position.y - ant.position.y, a.position.x - ant.position.x);
            let directionToB: number = Math.atan2(b.position.y - ant.position.y, b.position.x - ant.position.x);
            return Math.abs(directionToA - antDirection) - Math.abs(directionToB - antDirection);
        })
    }

    let targetTrail: Trail = trails[0];
    let targetAngle: number = Math.atan2(targetTrail.position.y - ant.position.y, targetTrail.position.x - ant.position.x);
    ant.direction = {x: Math.cos(targetAngle), y: Math.sin(targetAngle)};

}

export function updateDirection(ant: Ant): void{
    let newDirection:number = getForwardishDirection(ant, 10);
    // let newDirection:number = getRandomDirection();
    ant.direction = {x: Math.cos(newDirection), y: Math.sin(newDirection)};

}

function getForwardishDirection(ant:Ant, varianceDegrees:number){
    const directionVariance: number = varianceDegrees * Math.PI/180;
    let directionChange: number = Math.random() * (2 * directionVariance) - (directionVariance);
    return Math.atan2(ant.direction.y, ant.direction.x) + directionChange;
}

function getRandomDirection(){
    return Math.random() * 2 * Math.PI;
}

export function step(ant: Ant, delta: number): void{

    ant.position.x += ant.speed * ant.direction.x * delta;
    ant.position.y += ant.speed * ant.direction.y * delta;

}