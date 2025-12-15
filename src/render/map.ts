import renderer from "./renderer";
import type { Ant } from "../sim/ant";
import { updateDirection, step, spawnAnt, followTrail, avoidTrail } from "../sim/ant";
import type { Trail } from "../sim/trail";
import { spawnTrail } from "../sim/trail";
import type { Vec2 } from "../type/direction";

const ants:Ant[] = [];
let trails:Trail[] = [];
const antCount:number = 12;
let count:number = 0

renderer(
    ({ canvas, ctx }) => {
        const { width, height } = canvas;
        const centerCanvas:Vec2 = {x:width/2, y:height/2};
        for (let i = 0; i < antCount; i++){
            ants.push(spawnAnt(centerCanvas));
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
                ctx.fillStyle = `rgb(90,0,0)`;
            // } else if (ant.avoidTrail) {
            //     avoidTrail(ant, trails);
            //     trails.push(spawnTrail(ant.position));
            //     ctx.fillStyle = `rgb(0,90,0)`;
            } else {
                avoidTrail(ant, trails);
                trails.push(spawnTrail(ant.position));
                ctx.fillStyle = `rgb(0,90,0)`;
            }
            // } else {
            //     updateDirection(ant)
            //     trails.push(spawnTrail(ant.position));
            //     ctx.fillStyle = `rgb(0,0,90)`;
            // }
            step(ant, delta);

            // Let ant 'wrap' around the canvas
            ant.position = {
                x: ((ant.position.x % width) + width) % width, 
                y: ((ant.position.y % height) + height) % height
            };
            
            // ctx.fillStyle = `rgb(90,20,20)`;
            ctx.fillRect(ant.position.x-5, ant.position.y-5, 10, 10);
            ctx.fillStyle = `rgb(20,120,20)`;
            ctx.fillRect((ant.position.x-1) + (ant.direction.unit.x * 5), (ant.position.y-1) + (ant.direction.unit.y * 5), 2, 2);
            ctx.fillStyle = `rgb(200,200,200)`;
            ctx.beginPath();
            ctx.arc(ant.position.x, ant.position.y, ant.visionRange, 0, Math.PI * 2);
            ctx.stroke(); // or ctx.fill()
        }

    }
);