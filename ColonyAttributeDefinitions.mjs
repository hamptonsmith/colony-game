import nums from './FriendlyNumbers.mjs';
import rng from './Rng.mjs';
import seeded from 'seed-random';

export default {
    $helpers: {
        normal(mean, stdev, min, max) {
            return nums.clamp(rng.normal(mean, stdev), min, max);
        },
        log2(v) {
            return Math.log2(v);
        },
        floor(v) {
            return Math.floor(v);
        },
        bound(v, min, max) {
            return nums.clamp(v, min, max);
        },
        async productionGrowthFatedAt(size) {
            const seed = '' + await this.evaluate('seed');
            
            const biases = await biasTable.apply(this);
        
            const rng = seeded(`${seed}:${size}`);
            const roll = rng();
            
            return roll >= biases.innovation;
        },
        async innovationGrowthFatedAt(size) {
            const seed = '' + await this.evaluate('seed');
            const biases = await biasTable.apply(this);
        
            const rng = seeded(`${seed}:${size}`);
            const roll = rng();
            
            return roll >= biases.culture && roll < biases.innovation;
        },
        async cultureGrowthFatedAt(size) {
            const seed = '' + await this.evaluate('seed');
            const biases = await biasTable.apply(this);
        
            const rng = seeded(`${seed}:${size}`);
            const roll = rng();
            
            return roll < biases.culture;
        },
        random(min, max) {
            return Math.floor((max - min + 1) * Math.random()) + min;
        }
    },
    seed: {
        type: 'bfb',
        friendlyName: {
            en: 'Seed'
        },
        description: {
            en: 'A unique randomization seed.'
        },
        groundValue: '{{%random(100000000000, 999999999999)}}'
    },
    currentPopulation: {
        type: 'accum',
        friendlyName: {
            en: 'Current Population'
        },
        description: {
            en: 'The total number of people.'
        },
        initialValue: '%normal(2k, 0.5k, 1k, 4k)',
        change: 'currentPopulation * effectivePopulationGrowth'
    },
    production: {
        type: 'accum',
        friendlyName: {
            en: 'Production'
        },
        description: {
            en: 'The number of production points generated per year.'
        },
        initialValue: '0',
        change: `
            1 if totalOutputs < size
            and %productionGrowthFatedAt(totalOutputs), 0 otherwise
        `
    },
    totalOutputs: {
        type: 'bfb',
        friendlyName: {
            en: 'Total Outputs'
        },
        description: {
            en: 'The sum of culture, innovation, and production output.'
        },
        groundValue: 'culture + innovation + production'
    },
    innovation: {
        type: 'accum',
        friendlyName: {
            en: 'Innovation'
        },
        description: {
            en: 'The number of innovation points generated per year.'
        },
        initialValue: '0',
        change: `
            1 if totalOutputs < size
            and %innovationGrowthFatedAt(totalOutputs), 0 otherwise
        `
    },
    culture: {
        type: 'accum',
        friendlyName: {
            en: 'Culture'
        },
        description: {
            en: 'The number of culture points generated per year.'
        },
        initialValue: '0',
        change: `
            1 if totalOutputs < size
            and %cultureGrowthFatedAt(totalOutputs), 0 otherwise
        `
    },
    size: {
        type: 'bfb',
        friendlyName: {
            en: 'Colony Size'
        },
        description: {
            en: 'Size of the colony in powers of two.'
        },
        groundValue: '%bound(%floor(%log2(currentPopulation / 2k)), 0, 25)'
    },
    productionBias: {
        type: 'bfb',
        friendlyName: {
            en: 'Production Bias'
        },
        description: {
            en: 'Bias toward investing growth points in production.'
        },
        groundValue:
                '5 + %bound(5 - size, 0, 5) + %bound(production - 3, 0, 99)'
    },
    cultureBias: {
        type: 'bfb',
        friendlyName: {
            en: 'Culture Bias'
        },
        description: {
            en: 'Bias toward investing growth points in culture.'
        },
        groundValue: '%bound(5, 0, size) + culture'
    },
    innovationBias: {
        type: 'bfb',
        friendlyName: {
            en: 'Innovation Bias'
        },
        description: {
            en: 'Bias toward investing growth points in innovation.'
        },
        groundValue: '%bound(5, 0, size) + innovation'
    },
    totalBias: {
        type: 'bfb',
        friendlyName: {
            en: 'Total Growth Point Bias'
        },
        description: {
            en: 'Sum of culture, innovation, and production bias.'
        },
        groundValue: 'cultureBias + innovationBias + productionBias'
    },
    idealPopulationGrowth: {
        type: 'bfb',
        friendlyName: {
            en: 'Ideal Population Growth'
        },
        description: {
            en: 'Yearly population growth given ideal conditions.'
        },
        groundValue: '0.011'
    },
    effectivePopulationGrowth: {
        type: 'bfb',
        friendlyName: {
            en: 'Effective Population Growth'
        },
        description: {
            en: 'Actual yearly population growth given conditions on the '
                    + 'ground.'
        },
        groundValue: `
            idealPopulationGrowth
            * ((carryingCapacity - currentPopulation) / carryingCapacity)
        `
    },
    carryingCapacity: {
        type: 'bfb',
        friendlyName: {
            en: 'Population Carrying Capacity'
        },
        description: {
            en: 'Maximum supported population size.'
        },
        groundValue: '{{%normal(1m, 0.5m, 100k, 2.5m)}}'
    },
    carryingCapacityBonus1: {
        type: 'bfb',
        friendlyName: {
            en: 'Population Carrying Capacity Bonus 1'
        },
        description: {
            en: 'Additional maximum supported population with Tier 1 '
                    + 'Infrastructure.'
        },
        groundValue: '{{%normal(1b, 0.5b, 0.25b, 3b)}}'
    },
    carryingCapacityBonus2: {
        type: 'bfb',
        friendlyName: {
            en: 'Population Carrying Capacity Bonus 2'
        },
        description: {
            en: 'Additional maximum supported population with Tier 2 '
                    + 'Infrastructure.'
        },
        groundValue: '{{%normal(4b, 1b, 1b, 7b)}}'
    },
    carryingCapacityBonus3: {
        type: 'bfb',
        friendlyName: {
            en: 'Population Carrying Capacity Bonus 3'
        },
        description: {
            en: 'Additional maximum supported population with Tier 3 '
                    + 'Infrastructure.'
        },
        groundValue: '{{%normal(2b, 1b, 1b, 4b)}}'
    }
};

async function biasTable() {
    const productionBias = '' + await this.evaluate('productionBias');
    const cultureBias = '' + await this.evaluate('cultureBias');
    const innovationBias = '' + await this.evaluate('innovationBias');
    const totalBias = '' + await this.evaluate('totalBias');
    
    const cultureMax = cultureBias / totalBias;
    const innovationMax = cultureMax + (innovationBias / totalBias);
    
    return {
        culture: cultureMax,
        innovation: innovationMax
    };
}
