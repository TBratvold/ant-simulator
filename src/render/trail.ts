import type { Trail } from "../sim/trail";

export function renderTrail(trail:Trail, ctx:CanvasRenderingContext2D) {
    const trailWidth:number = 4;

    ctx.fillStyle = `rgba(60,20,40,${(trail.maxAge - trail.age)/trail.maxAge})`;

    ctx.beginPath();
    ctx.arc(trail.position.x, trail.position.y, trailWidth/2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}