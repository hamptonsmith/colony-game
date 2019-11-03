
export default {
    building: (reqDef, colony, source) => {
        return colony.hasBuilt(reqDef.building);
    }
};
