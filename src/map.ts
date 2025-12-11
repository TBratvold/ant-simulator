import renderer from "./renderer";
import type { Ant } from "./ant";
import { updateDirection, step, createAnt } from "./ant";


const speed: number = 0.03;
let x: number = 0;
let ant:Ant;
let count:number = 0;
renderer(
    ({ canvas, ctx }) => {
        const { width, height } = canvas;
        ant = createAnt(width/2, height/2);
    },
    (delta, { canvas, ctx }) => {
        const { width, height } = canvas;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = `rgb(40,40,60)`;
        ctx.fillRect(0, 0, width, height);

        count++;
        count = count % 100;
        if(count === 0){
            updateDirection(ant);
        }

        step(ant, delta);

        // Let ant 'wrap' around the canvas
        ant.position = {
            x: ((ant.position.x % width) + width) % width, 
            y: ((ant.position.y % height) + height) % height
        };
        
        ctx.fillStyle = `rgb(90,20,20)`;
        ctx.fillRect(ant.position.x-5, ant.position.y-5, 10, 10);
        ctx.fillStyle = `rgb(20,255,20)`;
        ctx.fillRect((ant.position.x-1) + (ant.direction.x * 5), (ant.position.y-1) + (ant.direction.y * 5), 2, 2);

    }
);