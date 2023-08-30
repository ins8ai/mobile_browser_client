// define ins8.ai api token and websocket endpoint
var api_token = ""
var webSocketUri = "wss://stt.ins8.ai/api/v1/stt/websocket/recognize?api_token=" + api_token;


// update transcription display
var transcribed_text = document.getElementById('transcription');
function on_transcription(text) {
    if (text.trim().length > 3){
        transcribed_text.textContent += text +  "\n";
        transcribed_text.scrollTop = transcribed_text.scrollHeight;
    }
}

// initialise microphone
function capturemicrophone(callback) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(function(microphone) {
        callback(microphone);
    }).catch(function(error) {
        alert('Unable to capture your microphone. Please check console logs.');
        console.error(error);
    });
} 

// stop recording
function stopRecordingCallback() {
    recorder.microphone.stop();
    recorder = null;
}


var recorder;
var ws;

function startWebsocket(){
    if (ws == null){
        ws = new WebSocket(webSocketUri);

        // log websocket connection errors
        ws.addEventListener('error', function (event) {
            console.log('WebSocket error: ', event);
        });

        // log connection opening of connection
        // send ins8.ai required parameters for the live connection
        ws.addEventListener('open', function (event) {
            console.log('WebSocket connection opened');
            ws.send(JSON.stringify({encoding: 'raw', sample_rate_hertz: 16000, stop_string: 'EOS'}));
        });

        // process transcriptions sent by ins8.ai
        ws.addEventListener('message', function (event) {
            console.log('Websocket message rec.: ', event.data);
            on_transcription(event.data);
        });
    }
}

// start recording
document.getElementById('btn-start-recording').onclick = function() {
    this.disabled = true;
    
    capturemicrophone(function(microphone) {

        recorder = RecordRTC(microphone.clone(), {
            recorderType: StereoAudioRecorder,
            mimeType: 'audio/wave',
            numberOfAudioChannels: 1,
            desiredSampRate: 16000,
            type: 'audio',
            timeSlice: 0, // real time
            ondataavailable: function(blob) {
                // start the websocket connection only after mic setup is done and we are ready to send data
                startWebsocket();

                // reader to transform blob wav data bytes to int16 pcm audio bytes
                // send data via websocket
                var reader = new FileReader();
                reader.onloadend = function() {
                    // Create a Int16Array view on the ArrayBuffer
                    // .slice(44) to remove first 44 bytes which are wav format related headers
                    var arrayBuffer = reader.result.slice(44);
                    var view = new DataView(arrayBuffer);
                    
                    var int16Array = new Int16Array(arrayBuffer);                    
                    if (ws && ws.readyState === WebSocket.OPEN) { ws.send(int16Array); } else {
                        console.log("websocket is not ready to send data");
                    }
                };
                reader.readAsArrayBuffer(blob);
            }
        });

        // start recording
        recorder.startRecording();

        // release microphone on stopRecording
        recorder.microphone = microphone;

        // enable the stop recording button
        document.getElementById('btn-stop-recording').disabled = false;
    });
};

document.getElementById('btn-stop-recording').onclick = function() {
    this.disabled = true;
    recorder.stopRecording(stopRecordingCallback);
    
    var stop_string = "EOS"
    var str_bytes = new Uint8Array(stop_string.length);
    for (var i = 0; i < stop_string.length; i++) {
        str_bytes[i] = stop_string.charCodeAt(i);
    }

    // close websocket connection
    if(ws) {
        ws.send(str_bytes);
        ws.close();
        ws = null;
    }
};
