import buildColony from './Colony.mjs';
import ev from './expressions.mjs';
import WebSocket from 'ws';

async function main() {
    if (process.argv[2]) {
        const result = await ev.evaluate(
                process.argv[2], JSON.parse(process.argv[3] || '{}'));
        console.log(result);
        process.exit(0);
    }

    const c = await buildColony();
    
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

    setInterval(async () => {
        try {
            const msg = JSON.stringify({
                type: 'update',
                content: await c.desc()
            });

            observers.forEach(o => o.send(msg));
        }
        catch (e) {
            console.log(e);
            process.exit(1);
        }
    }, 2000);

    setInterval(() => {
        c.step().catch(e => {
            console.log(e);
            process.exit(1);
        });
    }, 1000);
    
    async function doCommand(cmd) {
        const parts = cmd.split(' ');
        switch (parts[0]) {
            case 'build': {
                await c.setBuild(parts[1]);
                return `Building ${parts[1]}.`;
                break;
            }
            case 'instabuild': {
                await c.instaBuild(parts[1]);
                return `Insta-built ${parts[1]}.`;
            }
            default: {
                throw new Error('Unknown command: ' + parts[0]);
            }
        }
    }
}

main().catch(e => {
    console.log(e);
    process.exit(1);
});
