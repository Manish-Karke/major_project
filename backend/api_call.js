const WebSocket = require('ws');

// Replace with your WebSocket server URL
const serverUrl = 'wss://ray-champion-crow.ngrok-free.app/stream/';

// Create a WebSocket connection
const socket = new WebSocket(serverUrl);

// Prompt to send to the WebSocket server
const prompt = `Young people who commit crimes should be treated in the same way as adults who commit crimes. To what extent do you agree or disagree? Deciding to choose among the potential ways of punishing young people who commit crimes continues to be a controversial issue for the societies and the governments. It is argued by some that these people should be treated the same as adults. I personally disagree with this opinion due to the adverse effects of imprisonment on a teenager’s mental health. Many countries put the criminals of their society at jails considering it as a very effective way of punishment. It is understandable that this does exert a positive influence on decreasing crime in the society by putting the criminals in an unpleasant situation which they would mostly never wish to experience again. As a result, this could impede them from attempting crime in the future. For example, my friend who had been sent to jail for 2 months because of repeatedly committing traffic offends, has never committed the same crime since being released admitting that being in prison had been intolerable for her. However, I believe using the same way of punishment for youngsters would not be a wise idea. In fact, teenagers are at a very critical age in which the core of their personality is being shaped. There for, sending them to prison like adults as a way of punishment for their crimes, which are most often pity crimes, would actually expose them to other criminals who might have some serious personality disorders and this would adversely affect their personality as an adult in the future. To put in another way, such punishments are potential to become a threat to their mental health leading them to commit more serious crimes in a long run. For instance, according to the law of my country, young people are being punished the same as adults. A recent survey revealed that this policy has not been effective so far since 60% of these teenage criminals end up drug trafficking after being released from prison which had been sent to for a pity crime. In conclusion, although the ways that adults are being punished in many countries might be quite effective to decrease crime rate, I do not agree that it is a wise decision to use these ways for punishing young people as well.`;

// Handle WebSocket connection open event
socket.on('open', () => {
    console.log('Connected to the WebSocket server');

    // Send the prompt to the server
    socket.send(JSON.stringify({ prompt }));
});

// Handle WebSocket messages
socket.on('message', (data) => {
    const response = JSON.parse(data);

    if (response.token) {
        console.log('Received token:', response.token);
    } else if (response.status) {
        console.log('Status:', response.status);
    }
});

// Handle WebSocket errors
socket.on('error', (error) => {
    console.error('WebSocket error:', error);
});

// Handle WebSocket connection close event
socket.on('close', () => {
    console.log('Disconnected from the WebSocket server');
});
