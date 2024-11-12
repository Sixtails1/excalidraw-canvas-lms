import ReactDOM from "react-dom/client";
import { createShadowRootUi } from "wxt/client";
import App from "./App.tsx";

export default defineContentScript({
    matches: ["*://*/*"],
    async main(ctx) {
        // const [showContent, setShowContent] = useState(true);

        const ui = await createShadowRootUi(ctx, {
            name: "wxt-react-example",
            position: "inline",
            anchor: "body",
            append: "first",
            onMount: (container) => {
                // Don't mount react app directly on <body>
                const wrapper = document.createElement("div");
                container.append(wrapper);

                const root = ReactDOM.createRoot(wrapper);
                root.render(<App />);
                return { root, wrapper };
            },
            onRemove: (elements) => {
                elements?.root.unmount();
                elements?.wrapper.remove();
            },
        });

        // const styleElement = document.createElement('style');
        // styleElement.textContent = `body > :not(.injected-html) { display: none; }`;
        //
        // const hideContent = () => {
        //     try {
        //         if (showContent) {
        //             document.head.append(styleElement);
        //         } else {
        //             document.head.removeChild(styleElement);
        //         }
        //         setShowContent(!showContent);
        //     } catch (err) {
        //         console.error(`Failed to insert or remove CSS: ${err}`);
        //     }
        // }

        browser.runtime.onMessage.addListener((message) => {
            if (message.command === "inject") {
                ui.mount();
            } else if (message.command === "reset") {
                ui.remove();
            // } else if (message.command === "hideContent") {
            //     hideContent();
            }

        });
    }
})