import type { Ant } from "../sim/ant";
import { Direction, type Vec2 } from "../type/direction";

export function renderAnt(ant:Ant, ctx:CanvasRenderingContext2D){
    const antLength:number = 8;
    const antWidth:number = 6;

    const rightwards:Direction = Direction.deg(ant.direction.degrees + 90)
    const leftwards:Direction = Direction.deg(ant.direction.degrees - 90)

    const nose:Vec2 = {
        x: ant.position.x + (ant.direction.unit.x * antLength), 
        y: ant.position.y + (ant.direction.unit.y * antLength)
    };

    const rightShoulder:Vec2 = {
        x: ant.position.x + (rightwards.unit.x * antWidth/2),
        y: ant.position.y + (rightwards.unit.y * antWidth/2)
    }

    const leftShoulder:Vec2 = {
        x: ant.position.x + (leftwards.unit.x * antWidth/2),
        y: ant.position.y + (leftwards.unit.y * antWidth/2)
    }

    ctx.fillStyle = `rgb(120,30,30)`;
    ctx.beginPath();
    ctx.arc(ant.position.x, ant.position.y, antWidth/2, rightwards.radians, leftwards.radians);
    ctx.lineTo(nose.x, nose.y);
    ctx.lineTo(rightShoulder.x, rightShoulder.y);
    ctx.closePath();
    ctx.fill();
}

export function renderAntVisionRange(ant:Ant, ctx:CanvasRenderingContext2D) {
    ctx.fillStyle = `rgba(180,180,180,0.25)`;
    ctx.strokeStyle = `rgba(190,190,190,0.25)`;
    ctx.beginPath();
    ctx.arc(ant.position.x, ant.position.y, ant.visionRange, 0, Math.PI * 2);
    ctx.closePath();
    ctx.stroke();
}