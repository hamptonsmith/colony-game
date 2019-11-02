
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
                type: 'base',
                what: 'carryingCapacity',
                amount: 'carryingCapacityBonus1'
            }
        ]
    }
};
