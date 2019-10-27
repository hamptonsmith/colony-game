import ev from './expressions.mjs';

export default {
    bfb: {
        async buildGroundValue(def, symbolResolverFn) {
            return await ev.bindTemplate(def.groundValue, symbolResolverFn);
        },
        async buildAccumulator(ground, def, symbolResolverFn) {
            return {
                ground: await ev.evaluate(ground, symbolResolverFn),
                base: 0,
                factor: 1,
                bonus: 0
            };
        },
        async extractValue(accum, def, symbolResolverFn) {
            return (accum.ground + accum.base) * accum.factor + accum.bonus;
        },
        async step(currentGround, attrDef, symbolResolverFn) {
            return currentGround;
        }
    },
    accum: {
        async buildGroundValue(def, symbolResolverFn) {
            return await ev.evaluate(def.initialValue, symbolResolverFn);
        },
        async buildAccumulator(ground, def, symbolResolverFn) {
            return {
                ground: ground,
                base: 0,
                factor: 1,
                bonus: 0
            };
        },
        async extractValue(accum, def, symbolResolverFn) {
            return (accum.ground + accum.base) * accum.factor + accum.bonus;
        },
        async step(currentGround, def, symbolResolverFn) {
            return currentGround + 
                    await ev.evaluate(def.change, symbolResolverFn);
        }
    }
};
