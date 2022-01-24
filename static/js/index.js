import {isUserWinner} from "./game.js";

let video = document.querySelector("#videoElement");
let screenshot = document.querySelector("#screenshot");
let image = document.querySelector("#image");
let countdown = document.querySelector("#countdown");

const host = `${window.location.protocol}//${window.location.host}`;

const takeScreenshot = () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let count = 0;
    const timer = setInterval(() => {
        if (count === 0) {
            clearInterval(timer);

            countdown.innerHTML = "";
            canvas.getContext('2d')
                .drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL();
            image.src = dataUrl;

            sendImage(dataUrl)
                .then(processStatus)
                .then(handleResponse)
                .catch(handleError);
        } else {
            countdown.innerHTML = count;
            count--;
        }
    }, 1000);
}

screenshot.addEventListener("click", takeScreenshot);

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
        .then(stream => video.srcObject = stream)
        .catch(error => console.log(error));
} else {
    alert("You need webcam to use this application");
}

const sendImage = dataUrl => {
    return fetch(`${host}/game`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: dataUrl
    });
}

const processStatus = response => {
    if (!response.ok) {
        return response.json().then(response => {
            throw new Error(response.errorMessage)
        })
    }
    return response.json()
}

const handleResponse = response => {
    let message = `Your shape: ${response.user_option} Computer shape: ${response.computer_option}`;
    const isWinner = isUserWinner(response.user_option, response.computer_option);
    if (isWinner === null) {
        message += ` It's a draw!`;
    } else if (isWinner) {
        message += ` You won!`;
    } else {
        message += ` You lost.`;
    }

    alert(message);
}

const handleError = error => {
    alert(error.message);
}