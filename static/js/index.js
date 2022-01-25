import {isUserWinner} from "./game.js";

let video = document.querySelector("#videoElement");
let screenshot = document.querySelector("#screenshot");
let countdown = document.querySelector("#countdown");

let successAlert = $("#success-alert");
let failureAlert = $("#failure-alert");

const host = `${window.location.protocol}//${window.location.host}`;

const takeScreenshot = () => {
    screenshot.disabled = true;
    let count = 3;
    const timer = setInterval(() => {
        if (count === 0) {
            clearInterval(timer);
            countdown.innerHTML = "";

            const base64Image = getImageFromVideo();
            video.pause();

            sendImage(base64Image)
                .then(processStatus)
                .then(handleResponse)
                .catch(handleError)
                .finally(resumeVideo);
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

const sendImage = base64Image => {
    return fetch(`${host}/game`, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: base64Image
    });
}

const getImageFromVideo = () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    canvas.getContext('2d')
        .drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL();
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
    if (isWinner !== null) {
        if (isWinner) {
            message += ` You won!`;
        } else {
            message += ` You lost.`;
        }
    } else {
        message += ` It's a draw!`;
    }

    successAlert.text(message);
    successAlert.show()
    setTimeout(() => successAlert.hide(), 7000);
}

const handleError = error => {
    failureAlert.text(error.message);
    failureAlert.show();
    setTimeout(() => failureAlert.hide(), 5000);
}

const resumeVideo = () => {
    video.load();
    screenshot.disabled = false;
}