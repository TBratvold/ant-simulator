let lastTime: number | null = null;

const update = (onUpdate: (delta: number) => void) => (time: number) => {
    if (lastTime !== null) {
        const delta = time - lastTime;
        onUpdate(delta);
    }

    lastTime = time;
    window.requestAnimationFrame(update(onUpdate));
};

/**
 * Function that starts the rendering cycle and executes `onUpdate` at every frame.
 *
 * @param onInit Function executed once at first render
 * @param onUpdate Update function executed at every frame, given `delta` (time since last frame in milliseconds) and context (canvas)
 * @param id `id` of `canvas` element, `"canvas"` by default
 */
export default function renderer(
    onInit: (context: {
        ctx: CanvasRenderingContext2D;
        canvas: HTMLCanvasElement;
    }) => void,
    onUpdate: (
        delta: number,
        context: {
        ctx: CanvasRenderingContext2D;
        canvas: HTMLCanvasElement;
        }
    ) => void,
    id = "map"
) {
    const canvas = document.getElementById(id);
    if (canvas && canvas instanceof HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
    if (ctx) {
        onInit({ canvas, ctx });
        window.requestAnimationFrame(
            update((delta) => onUpdate(delta, { canvas, ctx }))
        );
    }
    }
}