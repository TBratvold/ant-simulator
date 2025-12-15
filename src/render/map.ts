import renderer from "./renderer";
import { renderAnt, renderAntVisionRange } from "./ant";
import type { SimulationState } from "../sim/simulation";
import { Simulation,  } from "../sim/simulation";

let simulation: Simulation;
let state: SimulationState;

renderer(
    ({ canvas, ctx }) => {
        const { width, height } = canvas;
        simulation = new Simulation(width, height, 8);
    },
    (delta, { canvas, ctx }) => {
        const { width, height } = canvas;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = `rgb(40,40,60)`;
        ctx.fillRect(0, 0, width, height);

        state = simulation.update(delta);

        for (const trail of state.trails) {
            ctx.fillStyle = `rgba(60,20,40,${(trail.maxAge - trail.age)/trail.maxAge})`;
            ctx.fillRect(trail.position.x-2, trail.position.y-2, 4, 4);
        }

        for (const ant of state.ants) {
            // renderAntVisionRange(ant, ctx);
            renderAnt(ant, ctx);
        }
    }
);