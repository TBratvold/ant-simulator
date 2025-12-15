import type { Trail } from "./trail";
import type { Vec2 } from "../type/direction";
import { Direction } from "../type/direction";
import { Angle } from "../type/angle";
import { absoluteDistanceBetween, applyVariance, directionTo, signedAngularDifference } from "../util/math";


export type Ant = {
    position: Vec2;
    direction: Direction;
    speed: number;
    followTrail: boolean;
    avoidTrail: boolean;
    visionRange: number;
}

const TAU = 2 * Math.PI;
type Segment = {
    start: Angle;
    end: Angle;
}

export function spawnAnt(position: Vec2): Ant{
    let direction:number = Math.random() * 2 * Math.PI
    return {
        position: {...position},
        direction: Direction.rad(direction),
        speed: 0.1,
        followTrail: direction > 2/3 * TAU,
        avoidTrail: direction < 1/3 * TAU,
        visionRange: 30
    };
}

export function followTrail(ant:Ant, trails:Trail[]): void{
    trails = trails.filter(trail => {
        return absoluteDistanceBetween(trail.position, ant.position) < ant.visionRange
    });

    if (trails.length < 1) {
        ant.direction = applyVariance(ant.direction, Angle.deg(30));
        return;
    } else if (trails.length > 1) {
        trails.sort((a, b) => {
            let directionToA: Direction = directionTo(ant.position, a.position);
            let directionToB: Direction = directionTo(ant.position, b.position);
            let directionDiffToA: Angle = signedAngularDifference(ant.direction, directionToA);
            let directionDiffToB: Angle = signedAngularDifference(ant.direction, directionToB);
            return Math.abs(directionDiffToA.radians) - Math.abs(directionDiffToB.radians);
        })
    }

    let targetTrail: Trail = trails[0];
    let targetDirection: Direction = directionTo(ant.position, targetTrail.position);
    ant.direction = applyVariance(targetDirection, Angle.deg(10));

}

export function avoidTrail(ant:Ant, trails:Trail[]): void{
    trails = trails.filter(trail => {
        return absoluteDistanceBetween(trail.position, ant.position) < ant.visionRange
    });

    if (trails.length < 1) {
        ant.direction = applyVariance(ant.direction, Angle.deg(10));
        return;
    }

    let avoidedSegments:Segment[] = getAvoidedSegments(ant, trails);
    avoidedSegments = normaliseSegments(avoidedSegments);
    avoidedSegments = mergeSegments(avoidedSegments);

    if(avoidedSegments.reduce((sum, s) => sum + (s.end.radians - s.start.radians), 0) >= TAU){
        ant.direction = applyVariance(ant.direction, Angle.deg(10));
        return;
    }

    // let desiredDirection: Direction = applyVariance(ant.direction, Angle.deg(10));
    let desiredDirection: Direction = ant.direction
    const illegalSegment:Segment | undefined = avoidedSegments.find(s => s.start.radians < desiredDirection.radians && s.end.radians > desiredDirection.radians);
    if (illegalSegment !== undefined) {
        const diffToStart: Angle = signedAngularDifference(ant.direction, Direction.rad(illegalSegment.start.radians));
        const diffToEnd: Angle = signedAngularDifference(ant.direction, Direction.rad(illegalSegment.start.radians));
        desiredDirection = Math.abs(diffToStart.radians) < Math.abs(diffToEnd.radians) ? Direction.rad(illegalSegment.start.radians) : Direction.rad(illegalSegment.end.radians);
    }
    ant.direction = applyVariance(desiredDirection, Angle.deg(10));
}

function getAvoidedSegments(ant:Ant , avoidedTrails:Trail[]): Segment[]{
    const segments:Segment[] = [];
    const range:Angle = Angle.deg(5)
    for (const position of avoidedTrails.map(t => t.position)) {
        const angleTo:Direction = directionTo(ant.position, position);
        segments.push({start: Angle.rad(angleTo.radians - range.radians), end: Angle.rad(angleTo.radians + range.radians)})
    }
    return segments;
}

function normaliseSegments(segments:Segment[]): Segment[]{
    const normalised: Segment[] = [];
    for (const seg of segments) {

        let start = (((seg.start.radians % TAU) + TAU) % TAU);
        let end = (((seg.end.radians % TAU) + TAU) % TAU);
        
        if (start < end){
            normalised.push({start: Angle.rad(start), end: Angle.rad(end)});
        } else {
            normalised.push({start: Angle.rad(start), end: Angle.rad(TAU)});
            normalised.push({start: Angle.rad(0), end: Angle.rad(end)});
        }
    }
    return normalised;
}

function mergeSegments(segments:Segment[]): Segment[]{
    // Merge overlapping segments
    segments.sort((a,b) => a.start.radians - b.start.radians);

    const merged: Segment[] = [];
    for(const seg of segments){
        if(merged.length === 0){
            merged.push({...seg})
            continue;
        }

        const last = merged[merged.length -1];
        if(seg.start.radians <= last.end.radians){
            last.end = Angle.rad(Math.max(seg.end.radians, last.end.radians));
        } else {
            merged.push({...seg});
        }
    }

    return merged;
}

export function updateDirection(ant: Ant): void{
    ant.direction = applyVariance(ant.direction, Angle.deg(10))
}

export function step(ant: Ant, delta: number): void{
    const {x, y} = ant.direction.unit;
    ant.position.x += ant.speed * x * delta;
    ant.position.y += ant.speed * y * delta;

}