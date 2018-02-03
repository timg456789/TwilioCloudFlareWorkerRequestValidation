# Cloudflare Workers

 - Deploy Cloudflare workers from source
 - Timestamp worker on upload to show last update in UI

## Usage

Upload Worker

    npm run upload-worker --
        --secrets-path C:\Users\peon\Desktop\personal.json
        --zone tgonzalez.net
        --path C:\Users\peon\Desktop\projects\TwilioCloudFlareWorkerRequestValidation\src\workers\twilio-request-validation.js

--secrets-path example

        {
            "twilioProductionToken": "",
            "cloudflareEmail": "",
            "cloudflareGlobalApiKey": ""
        }

**After the worker is deployed, a route must be added to enable the worker if not yet added**.

## Workers

### Twilio Request Validation Worker
Cryptographically verify incoming [Twilio](https://www.twilio.com/docs/api/security) webhooks in a [CloudFlare Worker](https://blog.cloudflare.com/introducing-cloudflare-workers/).

Expected request from Twilio webhook:

    Method: POST
    Url: https://tgonzalez.net/api/twilio/rekognition/sms-pot
    Headers: X-Twilio-Signature: url and body signed by each accounts twilio api token
    Body: ApiVersion=2010-04-01

If the request is signed by Twilio, a new POST will be made with the original url, body and x-twilio signature header. *No other request information is forwarded.* If the request is not signed by Twilio, the response below is returned:

    Status: 403
    Body: Request must be signed by Twilio. Provided signature SIGNATURE Twilio Signature Data DATA

## Links

[CloudFlare Worker Documentation](https://developers.cloudflare.com/workers/api/)