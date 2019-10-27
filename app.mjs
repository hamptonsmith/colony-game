//import Colony from './Colony.mjs';
//import WebSocket from 'ws';

import attrDefs from './ColonyAttributeDefinitions.mjs';
import buildAttributeTable from './AttributeTable.mjs';

async function main() {
    const at = await buildAttributeTable(attrDefs);
    console.log(await at.currentValues());
    
    await at.step();
    console.log(await at.currentValues());
    
    await at.step();
    console.log(await at.currentValues());

    await at.step();
    console.log(await at.currentValues());
}

main().catch(e => {
    console.log(e);
    process.exit(1);
});


/*
const c = new Colony();

const wss = new WebSocket.Server({
    port: 8080
});

const observers = [];

wss.on('connection', ws => {
    ws.on('message', msg => {
        doCommand(msg)
        .then(response => ws.send(JSON.stringify({
            type: 'info',
            content: response
        })))
        .catch(err => ws.send(JSON.stringify({
            type: 'error',
            content: err.message
        })));
    });
    
    observers.push(ws);
});

setInterval(() => {
    const msg = JSON.stringify({
        type: 'update',
        content: c.desc()
    });

    observers.forEach(o => o.send(msg));
}, 2000);

setInterval(() => {
    c.step();
}, 1000);

async function doCommand(cmd) {
    console.log('>>> ' + cmd);
}*/
