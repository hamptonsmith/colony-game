
export default {
    infra1: {
        friendlyName: {
            en: 'Tier 1 Infrastructure'
        },
        description: {
            en: 'Essential landing-zone infrastructure that significantly '+
                    'boosts carrying capacity.'
        },
        cost: 720,
        effects: [
            {
                type: 'baseIncrease',
                what: 'carryingCapacity',
                amount: 'carryingCapacityBonus1'
            }
        ]
    },
    infra2: {
        friendlyName: {
            en: 'Tier 2 Infrastructure'
        },
        description: {
            en: 'Planet-wide infrastructure that radically boosts carrying ' +
                    'capacity.'
        },
        cost: 3000,
        requires: [ { type: 'building', building: 'infra1' } ],
        effects: [
            {
                type: 'baseIncrease',
                what: 'carryingCapacity',
                amount: 'carryingCapacityBonus2'
            }
        ]
    }
};
