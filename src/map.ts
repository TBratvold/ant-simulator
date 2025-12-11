import renderer from "./renderer";
import type { Ant, Coordinate } from "./ant";
import { updateDirection, step, createAnt } from "./ant";


const speed: number = 0.03;
let x: number = 0;
let ants:Ant[] = [];
let count:number = 0;
let squares:Square[] = [];
renderer(
    ({ canvas, ctx }) => {
        const { width, height } = canvas;
        for(let i = 1; i < 4; i++){
            // ants.push(createAnt(width * Math.random(), height * Math.random()));
            ants.push(createAnt(width/2, height/2));
        }
        
        // squares = createSquares(500, width, height);
    },
    (delta, { canvas, ctx }) => {
        const { width, height } = canvas;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = `rgb(40,40,60)`;
        ctx.fillRect(0, 0, width, height);

        
        const ageLimit:number = 1000;
        squares = squares.filter(s => s.age < ageLimit);
        for(const square of squares){
            ctx.fillStyle = `rgba(0, 120, 120, ${(ageLimit - square.age) / ageLimit})`;
            // ctx.fillRect(square.position.x - square.size/2, square.position.y - square.size/2, square.size, square.size)
            ctx.beginPath();
            ctx.arc(
                square.position.x,      // center X
                square.position.y,      // center Y
                square.size / 2,        // radius
                0,
                Math.PI * 2             // full circle
            );
            ctx.fill();
            square.age += 1;
        }


        for (const ant of ants){
            updateDirection(ant, squares.map((s) => s.position));
            // console.log(ant);

            squares.push({position: ant.position, size: 5, age: 0});

            step(ant, delta);
            // Let ant 'wrap' around the canvas
            ant.position = {
                x: ((ant.position.x % width) + width) % width, 
                y: ((ant.position.y % height) + height) % height
            };
            
            ctx.fillStyle = `rgb(90,20,20)`;
            ctx.fillRect(ant.position.x-5, ant.position.y-5, 10, 10);
            ctx.fillStyle = `rgb(20,120,20)`;
            ctx.fillRect((ant.position.x-1) + (ant.direction.x * 5), (ant.position.y-1) + (ant.direction.y * 5), 2, 2);
        }

        

    }
);

type Square = {
    position: Coordinate;
    size: number;
    age: number;
}

function createSquares(n:number, maxX:number, maxY:number): Square[]{
    const squares:Square[] = [];
    for(let i = 0; i < n; i++){
        squares.push({
            position: {x:Math.random() * maxX,y:Math.random() * maxY},
            size: 5,
            age: 0
        });
    }
    return squares;
}