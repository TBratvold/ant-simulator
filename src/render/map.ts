import renderer from "./renderer";
import type { Ant } from "../sim/ant";
import { updateDirection, step, spawnAnt, followTrail } from "../sim/ant";
import type { Trail } from "../sim/trail";
import { spawnTrail } from "../sim/trail";
import type { Vec2 } from "../type/direction";
import { renderAnt, renderAntVisionRange } from "./ant";

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
            } else {
                updateDirection(ant)
                trails.push(spawnTrail(ant.position));
            }
            step(ant, delta);

            // Let ant 'wrap' around the canvas
            ant.position = {
                x: ((ant.position.x % width) + width) % width, 
                y: ((ant.position.y % height) + height) % height
            };

            // renderAntVisionRange(ant, ctx);
            renderAnt(ant, ctx);
        }

    }
);