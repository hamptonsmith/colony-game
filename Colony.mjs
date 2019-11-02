import buildAttributeTable from './AttributeTable.mjs';
import COLONY_ATTRIBUTES from './ColonyAttributeDefinitions.mjs';
import COLONY_PROJECTS from './ColonyProjects.mjs';
import rng from './Rng.mjs';

export default async function() {
    const at = await buildAttributeTable(COLONY_ATTRIBUTES);
    return new Colony(at);
}

export class Colony {
    constructor(at) {
        this.name = 'A Super Cool Colony';
        this.attributes = at;
        this.progress = {};
        this.buildings = [];
    }
    
    async step() {
        const currentValues = await this.attributes.currentValues();
        if (this.building) {
            if (this.progress[this.building] === undefined) {
                this.progress[this.building] = 0;
            }
            
            this.progress[this.building] += currentValues.production;
            
            if (this.progress[this.building] >=
                    COLONY_PROJECTS[this.building].cost) {
                this.buildings.push(this.building);
                this.building = undefined;
            }
        }
    
        await this.attributes.step();
    }
    
    async desc() {
        const result = {
            name: this.name,
            attributes: await this.attributes.currentValues(),
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
    
    setBuild(key) {
        if (!COLONY_PROJECTS[key]) {
            throw new Error('Unknown project key.');
        }
        
        this.building = key;
    }
}

// Colonies produce these resources:
//   - Production
//   - Culture
//   - Innovation

// Colonies require these for smooth functioning:
//   - Justice to match Cohesion

// Desirability

