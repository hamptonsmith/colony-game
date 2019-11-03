import ev from './expressions.mjs';

export default {
    baseIncrease: {
        appliesTo: (effectDesc, attrName, accum, symbolLookFn) => 
                effectDesc.what === attrName,
        
        async accumulate(effectDesc, attrName, accum, symbolLookupFn) {
            const delta = await ev.evaluate(effectDesc.amount, symbolLookupFn);
            accum.base += delta;
        }
    }
};
