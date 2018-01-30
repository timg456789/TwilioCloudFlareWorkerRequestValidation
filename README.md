Cryptographically verify incoming [Twilio](https://www.twilio.com/docs/api/security) webhooks in a [CloudFlare Worker](https://blog.cloudflare.com/introducing-cloudflare-workers/).

Expected request from Twilio webhook:

    Method: POST
    Url: https://tgonzalez.net/api/twilio/rekognition/sms-pot
    Headers: X-Twilio-Signature: url and body signed by each accounts twilio api token
    Body: ApiVersion=2010-04-01

If the request is signed by Twilio, a new POST will be made with the original url, body and x-twilio signature header. *No other request information is forwarded* If the request is not signed by Twilio, the response below is returned:

    Status: 403
    Body: Request must be signed by Twilio.

## Setup

1. Copy `twilio-request-validation.js` into a [web worker](https://www.cloudflare.com/a/workers/)
    1. Update the `twilioToken` and `twilioPath` variables
2. Setup a worker route under the `twilioPath` in CloudFlare
3. Add a url under the `twilioPath` to a Twilio phone number

