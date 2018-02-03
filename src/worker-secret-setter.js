const fs = require('fs');
function WorkerSecretSetter(secrets) {
    this.transform = function (worker) {
        worker = worker.replace('REPLACEABLE_SECRET_VDB12_TWILIO_TOKEN', secrets.twilioProductionToken);
        worker = worker.replace('REPLACEABLE_SECRET_VDB12_TIMESTAMP', new Date().toISOString());
        return worker;
    };
}
module.exports = WorkerSecretSetter;
