
const video = document.querySelector("video");
const textElem = document.querySelector("[data-text]");
async function setup() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    video.srcObject = stream

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

            document.addEventListener("keypress", async e => {
                if (e.code !== "Space") {
                    return
                }
                canvas.getContext("2d").drawImage(video, 0, 0, video.width, video.height)
                const { data: { text } } = await worker.recognize(canvas);
                
                speechSynthesis.speak(new SpeechSynthesisUtterance(text.replace(/\s/g, " ")))

                textElem.textContent = text
            })
        })();
    })
}
setup()