import renderer from "./renderer";
import type { Ant } from "./ant";
import { updateDirection, step, spawnAnt, followTrail } from "./ant";
import type { Trail } from "./trail";
import { spawnTrail } from "./trail";

const speed: number = 0.03;
let x: number = 0;
const ants:Ant[] = [];
let trails:Trail[] = [];
const antCount:number = 8;
let count:number = 0

renderer(
    ({ canvas, ctx }) => {
        const { width, height } = canvas;
        for (let i = 0; i < antCount; i++){
            ants.push(spawnAnt(width/2, height/2));
        }
    },
    (delta, { canvas, ctx }) => {
        const { width, height } = canvas;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = `rgb(40,40,60)`;
        ctx.fillRect(0, 0, width, height);

        count++;

        trails = trails.filter(trail => trail.age < trail.maxAge);
        for (const trail of trails){
            trail.age++;
            ctx.fillStyle = `rgba(60,20,40,${(trail.maxAge - trail.age)/trail.maxAge})`;
            ctx.fillRect(trail.position.x-2, trail.position.y-2, 4, 4);

        }

        for (const ant of ants){
            if (ant.followTrail){
                followTrail(ant, trails);
            } else {
                updateDirection(ant)
                trails.push(spawnTrail(ant.position.x, ant.position.y));
            }
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