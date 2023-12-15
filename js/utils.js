export const uuid = () => {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (
            c ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
        ).toString(16)
    );
};

export const getHandleLocations = (sprite) => {
    const handleSize = 10;
    let outer = [];
    let inner = [];

    for (let i = 0; i < 1.5; i += 0.5) {
        for (let j = 0; j < 1.5; j += 0.5) {
            if (i != 0.5 || j != 0.5) {
                const x = sprite.x + i * sprite.width;
                const y = sprite.y + j * sprite.height;

                outer.push({
                    x: x - handleSize / 2 + i * 2 - 1,
                    y: y - handleSize / 2 + j * 2 - 1,
                    width: handleSize,
                    height: handleSize,
                    i,
                    j,
                });

                inner.push({
                    x: x - handleSize / 2 + i * 2 + 1 - 1,
                    y: y - handleSize / 2 + j * 2 + 1 - 1,
                    width: handleSize - 2,
                    height: handleSize - 2,
                    i,
                    j,
                });
            }
        }
    }

    return { outer, inner };
};

export const PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr =
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio ||
            1;

    return dpr / bsr;
})();
