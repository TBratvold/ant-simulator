import type { SimulationState } from "../sim/simulation";
import { Simulation,  } from "../sim/simulation";
import renderer from "./renderer";
import { renderAnt, renderAntVisionRange } from "./ant";
import { renderTrail } from "./trail";

let simulation: Simulation;
let state: SimulationState;

renderer(
    ({ canvas, ctx }) => {
        const { width, height } = canvas;
        simulation = new Simulation(width, height, 12);
    },
    (delta, { canvas, ctx }) => {
        const { width, height } = canvas;
        
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = `rgb(40,40,60)`;
        ctx.fillRect(0, 0, width, height);

        state = simulation.update(delta);

        for (const trail of state.trails) {
            renderTrail(trail, ctx)
        }

        for (const ant of state.ants) {
            // renderAntVisionRange(ant, ctx);
            renderAnt(ant, ctx);
        }
    }
);