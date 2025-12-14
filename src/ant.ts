export type Ant = {
    position: {x: number, y: number};
    direction: {x: number, y: number};
    speed: number;
}

export function spawnAnt(x:number, y:number): Ant{
    let direction:number = Math.random() * 2 * Math.PI
    return {
        position: {x: x, y: y},
        direction: {x: Math.cos(direction), y: Math.sin(direction)},
        speed: 0.1
    };
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