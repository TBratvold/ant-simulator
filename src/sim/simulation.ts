import { Angle } from "../type/angle"; // Should be removed
import { Direction } from "../type/direction"; // Should be removed
import { applyVariance } from "../util/math";
import type { Ant } from "./ant";
import { followTrail, updateDirection, step, spawnAnt } from "./ant";
import type { Trail } from "./trail";
import { spawnTrail } from "./trail";
import { antInWall, type Wall } from "./wall";

export type SimulationState = {
    ants: Ant[];
    trails: Trail[];
}

export class Simulation {

    private _width:number;
    private _height:number;

    private _ants:Ant[] = [];
    private _trails:Trail[] = [];
    private _walls:Wall[] = []

    public constructor(width:number, height:number, initialAntCount: number){
        this._width = width;
        this._height = height;

        for (let i = 0; i < initialAntCount; i++){
            this._ants.push(spawnAnt({x: this._width/2, y: this._height/2}));
        }

        const borderWallThickness:number = 500;
        this._walls.push(
            { topLeft: {x:0, y:-borderWallThickness},   bottomRight: {x:this._width, y:0}                                   },
            { topLeft: {x:this._width, y:0},            bottomRight: {x:this._width + borderWallThickness, y:this._height}  },
            { topLeft: {x:0, y:this._height},           bottomRight: {x:this._width, y:this._height + borderWallThickness}  },
            { topLeft: {x:-borderWallThickness, y:0},   bottomRight: {x:0, y:this._height}                                  },
            { topLeft: {x:this._width/2+50, y:this._height/2+50},   bottomRight: {x:this._width/2+150, y:this._height/2+150}},
        );
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

            if (this._walls.reduce((inWall, wall) => {return inWall || antInWall(ant,wall)}, false)) {
                ant.direction = Direction.deg(ant.direction.degrees + 180);
                ant.direction = applyVariance(ant.direction, Angle.deg(90));
                step(ant, delta);
            }

            // // Let ant 'wrap' around the simulation
            // ant.position = {
            //     x: ((ant.position.x % this._width) + this._width) % this._width, 
            //     y: ((ant.position.y % this._height) + this._height) % this._height
            // };
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