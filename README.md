
# Sample ins8.ai client

Sample javascript codes for connecting to ins8.ai's real time websocket API endpoint

## Steps to run

1. edit line 1 of ins8ai_mobile.js file and add the API token string for authorised usage.
you can get an API token string from the trial usage portal https://dev.ins8.ai/dashboard
2. run index.html with chrome or firefox browser on your desktop

### Testing on a mobile browser

You can host web page on a server and visit the link using a iOS / android based mobile browser.
Alternatively, you can use ngrok to mirror and test the webpage on your mobile phone.

## Codes explained

We leverage the open source RecordRTC javascript library to read audio from microphone source available to the browser.
We convert raw audio bytes to 16-bit signed integer values to conform to the 16-bit signed PCM audio format expected by the ins8.ai product.


