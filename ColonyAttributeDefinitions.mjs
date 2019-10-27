import nums from './FriendlyNumbers.mjs'
import rng from './Rng.mjs'

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
        }
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
}
