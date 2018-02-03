const fetch = require('node-fetch-npm');
const fs = require('fs');
const targetZone = getArg('zone');
const WorkerSecretSetter = require('./worker-secret-setter');
const secrets = require(getArg('secrets-path'));
let workerSecretSetter = new WorkerSecretSetter(secrets);

function getArg(arg) {
    for (let index = 0; index < process.argv.length; index += 2) {
        if (process.argv[index] === '--' +arg) {
            return process.argv[index+1];
        }
    }
}

function throwIfErrors(json) {
    if (json.errors && json.errors.length > 0) {
        return Promise.reject(json);
    }
    return Promise.resolve(json);
}

function getCredentials(email, apiKey) {
    return {
        'X-Auth-Email': email,
        'X-Auth-Key': apiKey
    };
}

const cloudflareCredentials = getCredentials(secrets.cloudflareEmail, secrets.cloudflareGlobalApiKey);

fetch('https://api.cloudflare.com/client/v4/zones', { headers: cloudflareCredentials })
    .then((result) => result.json())
    .then((json) => throwIfErrors(json))
    .then((zones) => zones.result.filter(x => x.name === targetZone).pop())
    .then((matchedZone) => {
        const workerPath = getArg('path');
        const worker = workerSecretSetter.transform(fs.readFileSync(workerPath, 'utf8'));
        console.log(`Sending worker ${workerPath} to zone ${matchedZone.id}`);
        let updateParams = {
            method: 'PUT',
            headers: {
                'X-Auth-Email': secrets.cloudflareEmail,
                'X-Auth-Key': secrets.cloudflareGlobalApiKey,
                'content-type': 'text/javascript; charset=UTF-8'
            },
            body: worker
        };
        return fetch(`https://api.cloudflare.com/client/v4/zones/${matchedZone.id}/workers/script`, updateParams);
    })
    .then((result) => result.json())
    .then((json) => throwIfErrors(json))
    .then((uploadResult) => {
        console.log('\r\nworker updated ' + uploadResult.result.etag);
    })
    .catch((error) => {
        console.log('error');
        console.log(error);
    });
