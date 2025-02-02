import * as utils from './utils/api.js';
import banner from './utils/banner.js';
import log from './utils/logger.js';
import { delay } from './utils/helper.js'
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

const formatProxy = (proxy) => {
    if (!proxy) return null;
    
    if (proxy.startsWith('http://') || proxy.startsWith('https://')) {
        return proxy;
    }

    const parts = proxy.split(':');
    if (parts.length === 4) {
        const [ip, port, username, password] = parts;
        return `http://${username}:${password}@${ip}:${port}`;
    }
    
    if (parts.length === 2) {
        return `http://${proxy}`;
    }

    return null;
};

const main = async () => {
    log.info(banner);
    await delay(3);

    let tokens = [];
    let proxies = [];

    const tokenInput = await question('Please enter the token (Multiple tokens are separated by comma): ');
    tokens = tokenInput.split(',').map(t => t.trim()).filter(t => t);

    if (tokens.length === 0) {
        log.error('Unswalted to token');
        rl.close();
        return;
    }

    const useProxy = await question('Whether to use an agent? (y/n): ');
    if (useProxy.toLowerCase() === 'y') {
        const proxyInput = await question('Please enter the proxy address (Multiple agents are separated by comma，Format: ip:port:username:password or ip:port): ');
        proxies = proxyInput.split(',')
            .map(p => p.trim())
            .map(formatProxy)
            .filter(p => p);
    }

    rl.close();

    try {
        log.info(`Starting programs for all accounts:`, tokens.length);

        const tasks = tokens.map(async (token, index) => {
            const proxy = proxies.length > 0 ? proxies[index % proxies.length] : null;
            try {

                const userData = await utils.getUserInfo(token, proxy);

                if (userData?.data) {
                    const { email, verified, current_tier, points_balance } = userData.data
                    log.info(`Account ${index + 1} information:`, { email, verified, current_tier, points_balance });
                }


                await checkUserRewards(token, proxy, index);


                setInterval(async () => {
                    const connectRes = await utils.connect(token, proxy);
                    log.info(`Account ${index + 1} Ping result:`, connectRes || { message: 'Unknown error' });

                    const result = await utils.getEarnings(token, proxy);
                    log.info(`Account ${index + 1} Result:`, result?.data || { message: 'Unknown error' });
                }, 1000 * 30); // Run every 30 seconds


                setInterval(async () => {
                    await checkUserRewards(token, proxy, index);
                }, 1000 * 60 * 60 * 24); // Check every 24 hours

            } catch (error) {
                log.error(`Processing account ${index + 1} Wrong: ${error.message}`);
            }
        });

        await Promise.all(tasks);
    } catch (error) {
        log.error(`Main cycle error: ${error.message}`);
    }
};


const checkUserRewards = async (token, proxy, index) => {
    try {
        const response = await utils.getUserRef(token, proxy)
        const { total_unclaimed_points } = response?.data || 0;
        if (total_unclaimed_points > 0) {
            log.info(`Account ${index + 1} have ${total_unclaimed_points} Unexposed points，Try to collect...`);
            const claimResponse = await utils.claimPoints(token, proxy);
            if (claimResponse.code === 200) {
                log.info(`Account ${index + 1} Successful collection ${total_unclaimed_points} Integral！`);
            }
        }
    } catch (error) {
        log.error(`Error when checking user rewards: ${error.message}`);
    }
}


process.on('SIGINT', () => {
    log.warn(`Receive the SIGINT signal, clean up and exit the program ...`);
    rl.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    log.warn(`Receive the Sigterm signal, clean up and exit the program ...`);
    rl.close();
    process.exit(0);
});


main();
