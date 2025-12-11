const TAU = Math.PI * 2;

export type Ant = {
    position: {x: number, y: number};
    direction: {x: number, y: number};
    speed: number;
}

export type Segment = {
    start: number;
    end: number;
}

export type Coordinate = {
    x: number;
    y: number;
}

export function createAnt(x:number, y:number): Ant{
    return {
        position: {x: x, y: y},
        direction: {x: 1, y: 0},
        speed: 0.2
    };
}

export function updateDirection(ant: Ant, avoidedCoordinates: Coordinate[]): void{
    // avoidedCoordinates = avoidedCoordinates.filter(c => Math.hypot(ant.position.x - c.x, ant.position.y - c.y) < 20)
    let avoidedCoordinatesPrime = avoidedCoordinates.filter(c => {
        const visionCircleSize:number = 20;
        let visionCircleCenterX:number =  ant.position.x + visionCircleSize*ant.direction.x;
        let visionCircleCenterY:number =  ant.position.y + visionCircleSize*ant.direction.y;
        let dx:number = visionCircleCenterX - c.x;
        let dy:number = visionCircleCenterY - c.y;
        return dx < visionCircleSize && dy < visionCircleSize;
    })
    // console.log(avoidedCoordinates)
    if(avoidedCoordinatesPrime.length < 10){
        return;
    }
    
    let avoidedSegments:Segment[] = getAvoidedSegments(ant, avoidedCoordinatesPrime);
    // avoidedSegments.push({
    //     start: Math.atan2(ant.direction.y, ant.direction.x) + (20 * (Math.PI/180)),
    //     end: Math.atan2(ant.direction.y, ant.direction.x) - (20 * (Math.PI/180))});
    avoidedSegments = normaliseSegments(avoidedSegments);
    avoidedSegments = mergeSegments(avoidedSegments);

    const totalAvoided:number = avoidedSegments.reduce((sum, seg) => sum + (seg.end - seg.start), 0);
    const totalAllowed:number = TAU - totalAvoided;

    if(totalAllowed === 0){
        // ant.speed = 0;
        let angle:number = Math.atan2(ant.direction.y, ant.direction.x)
        angle += (90 * (Math.PI/180))
        ant.direction = {x: Math.cos(angle), y: Math.sin(angle)};
        console.log(totalAllowed*180/Math.PI)
        return;
        // return updateDirection(ant, avoidedCoordinates);
    }
    // console.log(totalAvoided*180/Math.PI)

    let angle:number = Math.random() * totalAllowed;
    for(const seg of avoidedSegments){
        if(angle < seg.start){
            break;
        } else {
            angle += seg.end - seg.start;
        }
    }

    ant.direction = {x: Math.cos(angle), y: Math.sin(angle)};
}

export function step(ant: Ant, delta: number): void{
    ant.position.x += ant.speed * ant.direction.x * delta;
    ant.position.y += ant.speed * ant.direction.y * delta;
}

function getAvoidedSegments(ant:Ant , avoidedCoordinates: Coordinate[]): Segment[]{
    const segments:Segment[] = [];
    const range = 5 * (Math.PI/180) // +/- 5 degrees
    for (const coord of avoidedCoordinates) {
        const dx = coord.x - ant.position.x;
        const dy = coord.y - ant.position.y;
        const angle = Math.atan2(dy, dx);
        segments.push({start: angle - range, end: angle + range})
    }
    return segments;
}

function normaliseSegments(segments:Segment[]): Segment[]{
    const normalised: Segment[] = [];
    for (const seg of segments) {

        let start = (((seg.start % TAU) + TAU) % TAU);
        let end = (((seg.end % TAU) + TAU) % TAU);
        
        if (start < end){
            normalised.push({start: start,end: end});
        } else {
            normalised.push({start: start,end: TAU});
            normalised.push({start: 0,end: end});
        }
    }
    return normalised;
}

function mergeSegments(segments:Segment[]): Segment[]{
    // Merge overlapping segments
    segments.sort((a,b) => a.start - b.start);

    const merged: Segment[] = [];
    for(const seg of segments){
        if(merged.length === 0){
            merged.push({...seg})
            continue;
        }

        const last = merged[merged.length -1];
        if(seg.start <= last.end){
            last.end = Math.max(seg.end, last.end);
        } else {
            merged.push({...seg});
        }
    }

    return merged;
}

// function getAvoidedAngleSegments(segments:Segment[]): Segment[]{
//     // Make all segments go from 0-TAU and split segments that 'go over' TAU (eg. 1.5pi-0.5pi)
//     const normalised: Segment[] = [];
//     for (const seg of segments) {

//         let start = (((seg.start % TAU) + TAU) % TAU);
//         let end = (((seg.end % TAU) + TAU) % TAU);
        
//         if (start < end){
//             normalised.push({start: start,end: end});
//         } else {
//             normalised.push({start: start,end: TAU});
//             normalised.push({start: 0,end: end});
//         }
//     }

//     // Merge overlapping segments
//     normalised.sort((a,b) => a.start - b.start);

//     const merged: Segment[] = [];
//     for(const seg of normalised){

//         if(merged.length === 0){
//             merged.push({...seg})
//             continue;
//         }

//         const last = merged[merged.length -1];
//         if(seg.start <= last.end){
//             last.end = Math.max(seg.end, last.end);
//         } else {
//             merged.push({...seg});
//         }
//     }

//     return merged;
// }