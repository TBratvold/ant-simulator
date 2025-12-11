export type Ant = {
    position: {x: number, y: number};
    direction: {x: number, y: number};
    speed: number;
}

export function createAnt(x:number, y:number): Ant{
    return {
        position: {x: x, y: y},
        direction: {x: 1, y: 0},
        speed: 0.1
    };
}

export function updateDirection(ant: Ant): void{

    let length:number = 0;
    let x: number = 0;
    let y: number = 0;
    while(length === 0){
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        length = Math.hypot(x,y);
    }

    ant.direction = {x: x/length, y: y/length};
}

export function step(ant: Ant, delta: number): void{

    ant.position.x += ant.speed * ant.direction.x * delta;
    ant.position.y += ant.speed * ant.direction.y * delta;

}