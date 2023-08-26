const video = document.querySelector("video");
const textElem = document.querySelector("[data-text]");
const startBtn = document.querySelector("button");
const switchCameraButton = document.getElementById('switchCameraButton');
let currentFacingMode = 'user'; // Initialize with front camera

async function setup() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    video.srcObject = stream
    switchCameraButton.addEventListener('click', () => {
        currentFacingMode = (currentFacingMode === 'user') ? 'environment' : 'user';
        const newConstraints = { video: { facingMode: currentFacingMode } };
      
        // Stop the current stream
        if (videoElement.srcObject) {
          videoElement.srcObject.getTracks().forEach(track => track.stop());
        }
      
        // Get new stream with updated constraints
        navigator.mediaDevices.getUserMedia(newConstraints)
          .then(newStream => {
            videoElement.srcObject = newStream;
          })
          .catch(error => {
            console.error('Error switching camera:', error);
          });
      });
    video.addEventListener("playing", async () => {
        const worker = await Tesseract.createWorker({
            logger: m => console.log(m)
        });
        (async () => {
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const canvas = document.createElement("canvas")
            canvas.height = video.height
            canvas.width = video.width

            startBtn.addEventListener("click", async () => {
                canvas.getContext("2d").drawImage(video, 0, 0, video.width, video.height)
                const { data: { text } } = await worker.recognize(canvas);
                
                speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/\s/g, " ")))

                textElem.textContent = text
            })
        })();
    })
}
setup()