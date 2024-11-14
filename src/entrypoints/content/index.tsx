import './style.css';

/*
<div class="excalidraw-wrapper">
    <button type="button"></button>
    <div data-wxt-iframe="">
        <iframe src="#">
        </iframe>
    </div>
</div>


*/
export default defineContentScript({
    matches: ["https://*.instructure.com/courses/*/quizzes/*", "http://*.instructure.com/courses/*/quizzes/*"],
    async main(ctx) {
        const questions = document.querySelectorAll('.question');
        questions.forEach((question) => {
            const injectButton = document.createElement("button");
            injectButton.textContent = "Excalidraw";
            injectButton.classList.add("excalidraw-inject-button");
            injectButton.type = "button";

            const fullscreenButton = document.createElement("button");
            fullscreenButton.textContent = "Fullscreen";
            fullscreenButton.classList.add("excalidraw-fullscreen-button");
            fullscreenButton.type = "button";

            //TODO:
            // const exitFullscreenButton = document.createElement("button");
            // exitFullscreenButton.innerHTML = `
            // <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            //     <path d="M4 4L20 20M20 4L4 20" stroke="black" stroke-width="2" stroke-linecap="round"/>
            // </svg>`;
            // exitFullscreenButton.classList.add("excalidraw-exit-fullscreen-button", "hidden");
            // exitFullscreenButton.type = "button";

            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("excalidraw-button-container");
            buttonContainer.append(injectButton);
            buttonContainer.append(fullscreenButton);


            const htmlInjectionRoot = document.createElement("div");
            htmlInjectionRoot.classList.add("excalidraw-root-container");
            htmlInjectionRoot.append(buttonContainer);


            //TODO:
            // let isFullscreen = false;
            // fullscreenButton.addEventListener("click", () => {
            //     if (isFullscreen) {
            //     } else {
            //     }
            // })


            const iframe = createIframeUi(ctx, {
                page: '/excalidraw-iframe.html',
                position: 'inline',
                anchor: htmlInjectionRoot,
                onMount: (wrapper, iframe) => {
                    wrapper.classList.add("excalidraw-iframe-container");
                },
            });

            let showIFrame = true;
            injectButton.addEventListener("click", () => {
                if (showIFrame) {
                    iframe.mount();
                } else {
                    iframe.remove();
                }
                showIFrame = !showIFrame
            })

            const ui = createIntegratedUi(ctx, {
                position: 'inline', anchor: question, onMount: (container) => {
                    container.append(htmlInjectionRoot);
                },
            });
            ui.mount();
        });
    }
})