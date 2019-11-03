import buildAttributeTable from './AttributeTable.mjs';
import clone from 'clone';
import COLONY_ATTRIBUTES from './ColonyAttributeDefinitions.mjs';
import COLONY_PROJECTS from './ColonyProjects.mjs';
import rng from './Rng.mjs';

export default async function() {
    const at = await buildAttributeTable(COLONY_ATTRIBUTES);
    return new Colony(at);
}

export class Colony {
    
    // Attribute tables have to be built asynchronously, so it's passed in for
    // a synchronous constructor.
    constructor(at) {
        this.name = 'A Super Cool Colony';
        this.attributes = at;
        this.progress = {};
        this.buildings = [];
    }
    
    async step() {
        const effectAccum = this.activeEffects();
        
        const currentValues =
                await this.attributes.currentValues(effectAccum);
        
        if (this.building) {
            if (this.progress[this.building] === undefined) {
                this.progress[this.building] = 0;
            }
            
            this.progress[this.building] += currentValues.production.value;
            
            if (this.progress[this.building] >=
                    COLONY_PROJECTS[this.building].cost) {
                this.buildings.push(this.building);
                this.building = undefined;
            }
        }
    
        await this.attributes.step(effectAccum);
    }
    
    async desc() {
        const effectAccum = this.activeEffects();
        
        const result = {
            name: this.name,
            attributes: await this.attributes.currentValues(effectAccum),
            building: this.building,
            couldBuild: Object.keys(COLONY_PROJECTS)
        };
        
        if (this.building) {
            result.progress = {
                accumulated: this.progress[this.building],
                required: COLONY_PROJECTS[this.building].cost
            };
        }
        
        return result;
    }
    
    activeEffects() {
        const effectAccum = [];
        this.buildings.forEach(
                buildingName => COLONY_PROJECTS[buildingName].effects.forEach(
                        e => effectAccum.push(extend(
                                e, { source: { building: buildingName }}))));
        return effectAccum;
    }
    
    setBuild(key) {
        if (!COLONY_PROJECTS[key]) {
            throw new Error('Unknown project key.');
        }
        
        this.building = key;
    }
}

function extend(o, w) {
    const result = clone(o);
    Object.keys(w).forEach(k => {
        result[k] = clone(w[k]);
    });
    
    return result;
}

// Colonies produce these resources:
//   - Production
//   - Culture
//   - Innovation

// Colonies require these for smooth functioning:
//   - Justice to match Cohesion

// Desirability

