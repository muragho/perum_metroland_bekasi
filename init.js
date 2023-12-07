const { db } = require('./configs/Database.js');
const statusService = require('./services/Status.service.js');

async function main() {

    console.info(`start init`);

    // const statusList = ['Active', 'Block', 'Resign'];

    try {
        (async () => {
            await db.conn.sync({
                force: false
            });
        })();

    } catch (error) {
        console.error(error)
    }
    console.info(`finish init`);

}

// main();