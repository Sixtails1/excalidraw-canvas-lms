import ReactDOM from "react-dom/client";
import { createShadowRootUi } from "wxt/client";

export default defineContentScript({
    matches: ["*://*/*"],
    async main(ctx) {

        const ui = createIframeUi(ctx, {
            page: '/excalidraw-iframe.html',
            position: 'inline',
            anchor: 'body',
            onMount: (wrapper, iframe) => {
            },
        });

        browser.runtime.onMessage.addListener((message) => {
            if (message.command === "inject") {
                ui.mount();
            } else if (message.command === "reset") {
                ui.remove();
            }
        });
    }
})