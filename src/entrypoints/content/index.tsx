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

const createInjectButton = () => {
    const injectButton = document.createElement("button");
    injectButton.textContent = "Excalidraw";
    injectButton.classList.add("excalidraw-inject-button");
    injectButton.type = "button";
    injectButton.innerHTML = `
    <p>Open Excalidraw</p> 
    <svg class="excalidraw-dropdown-triangle-icon" viewBox="0 0 100 60" xmlns="http://www.w3.org/2000/svg">
        <polyline points="10,10 90,10 50,50 10,10"
                  stroke="black"
                  fill="black"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="10"
                  transform="rotate(0.5turn)"/>
    </svg>`;

    return injectButton
}

const createFullscreenButton = () => {
    const fullscreenButton = document.createElement("button");
    fullscreenButton.classList.add("excalidraw-fullscreen-button");
    fullscreenButton.type = "button";
    fullscreenButton.innerHTML = `
    <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg" stroke-width="16" stroke-linecap="round" stroke="black" fill="transparent">
        <!-- First arrow -->
        <g class="excalidraw-fullscreen-arrow">
            <path d="M74,54 L114,14"/>
            <path d="M72,8 h40 c0,0 8,0 8,8 v40"/>
        </g>
        <!-- Mirrored arrow -->
        <g class="excalidraw-fullscreen-arrow-mirror" transform="scale(-1, -1) translate(-128, -128)">
            <path d="M74,54 L114,14"/>
            <path d="M72,8 h40 c0,0 8,0 8,8 v40"/>
        </g>
    </svg>`;
    return fullscreenButton;
}

export default defineContentScript({
    matches: ["https://*.instructure.com/courses/*/quizzes/*", "http://*.instructure.com/courses/*/quizzes/*"],
    async main(ctx) {
        const questions = document.querySelectorAll('.question');
        questions.forEach((question) => {
            const htmlInjectionRoot = document.createElement("div");
            htmlInjectionRoot.classList.add("excalidraw-root-container");

            const injectButton = createInjectButton();
            htmlInjectionRoot.append(injectButton);

            const fullscreenButton = createFullscreenButton();

            const iframe = createIframeUi(ctx, {
                page: "/excalidraw-iframe.html",
                position: 'inline',
                anchor: htmlInjectionRoot,
                onMount: (wrapper, iframe) => {
                    wrapper.classList.add("excalidraw-iframe-container");
                    wrapper.prepend(fullscreenButton);
                }
            });
            iframe.iframe.src += `?id=${question.id}`;

            const fullscreenHandler = () => {
                iframe.wrapper.classList.toggle("fullscreen");
                console.log("fullscreen-toggled");
            }

            const fullscreenHandlerEscape = (event: KeyboardEvent) => {
                if (event.key === "Escape" && iframe.wrapper.classList.contains("fullscreen")) {
                    iframe.wrapper.classList.remove("fullscreen");
                }
            }

            let showIFrame = false;
            injectButton.addEventListener("click", () => {
                showIFrame = !showIFrame
                injectButton.setAttribute("aria-expanded", String(showIFrame));

                if (showIFrame) {
                    fullscreenButton.addEventListener("click", fullscreenHandler);
                    document.addEventListener('keydown', fullscreenHandlerEscape);
                    iframe.mount();
                } else {
                    fullscreenButton.removeEventListener("click", fullscreenHandler);
                    document.removeEventListener('keydown', fullscreenHandlerEscape);
                    iframe.wrapper.classList.remove("fullscreen");
                    iframe.remove();
                }
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