import type { Ant } from "./ant";
import { followTrail, updateDirection, step, spawnAnt } from "./ant";
import type { Trail } from "./trail";
import { spawnTrail } from "./trail";

export type SimulationState = {
    ants: Ant[];
    trails: Trail[];
}

export class Simulation {

    private _width:number;
    private _height:number;

    private _ants:Ant[] = [];
    private _trails:Trail[] = [];

    public constructor(width:number, height:number, initialAntCount: number){
        this._width = width;
        this._height = height;

        for (let i = 0; i < initialAntCount; i++){
            this._ants.push(spawnAnt({x: this._width/2, y: this._height/2}));
        }
    }

    public update(delta:number): SimulationState {
        this._trails = this._trails.filter(trail => trail.age < trail.maxAge);
        for (const trail of this._trails){
            trail.age++;
        }

        for (const ant of this._ants){
            if (ant.followTrail){
                followTrail(ant, this._trails);
            } else {
                updateDirection(ant)
                this._trails.push(spawnTrail(ant.position));
            }
            step(ant, delta);

            // Let ant 'wrap' around the simulation
            ant.position = {
                x: ((ant.position.x % this._width) + this._width) % this._width, 
                y: ((ant.position.y % this._height) + this._height) % this._height
            };
        }

        return this.state;
    }

    get state(): SimulationState{
        return {
            ants: this._ants,
            trails: this._trails
        }
    }
}