
# Sample ins8.ai client

Sample javascript codes for connecting to ins8.ai's real time websocket API endpoint

## Steps to run

1. edit line 1 of ins8ai_mobile.js file and add the API token string.
   - API token string from the trial usage portal https://dev.ins8.ai/dashboard
   - API token string can also be obtained by registering a user within a privately hosted ins8.ai instance
3. run index.html with chrome or firefox browser on your desktop

### Testing on a mobile browser

You can host index.html on a server, expose and visit it using an iOS or android based mobile browser.
Alternatively, you can use ngrok to mirror and test the test link webpage on your mobile phone.

## Codes explained

We leverage the open source RecordRTC javascript library to read audio from microphone source connected to the browser.
We then convert raw audio bytes to 16-bit signed integer values (16-bit signed PCM audio format) and send it via a websocket connection to the ins8.ai API endpoint.
