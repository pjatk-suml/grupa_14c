import {isUserWinner} from "./game.js";

let video = document.querySelector("#videoElement");
let screenshot = document.querySelector("#screenshot");
let image = document.querySelector("#image");
let countdown = document.querySelector("#countdown");

const takeScreenshot = () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    let count = 3;
    const timer = setInterval(() => {
        if (count === 0) {
            clearInterval(timer);

            countdown.innerHTML = "";
            canvas.getContext('2d')
                .drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL();
            image.src = dataUrl;

            //TODO: get localhost dynamically
            fetch('http://localhost:8080/game', {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: dataUrl
            })
                .then(response => {
                    if (!response.ok) {
                        return response.json().then(response => {throw new Error(response.errorMessage)})
                    }
                    return response.json()
                })
                .then(response => {
                    console.log(response)
                    let winner = isUserWinner(response.user_option, response.computer_option);
                    console.log(winner);
                })
                .catch(error => alert(error.message));
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