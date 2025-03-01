// import {Excalidraw} from "@excalidraw/excalidraw";
// @ts-ignore
// Prevent the eval from the development build from being included.
import {Excalidraw, ExcalidrawAPI, THEME} from "@excalidraw/excalidraw/dist/excalidraw.production.min";
import React, { useEffect, useState, useCallback } from 'react';
import {storage} from 'wxt/storage';

// const App = () => {
//     const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawAPI | null>(null);
//     const questionId = new URLSearchParams(window.location.search).get("id");
//
//     const initialData = async () => {
//         // // @ts-ignore
//         // initialDrawing.libraryItems = {};
//         // // @ts-ignore
//         // initialDrawing.scrollToContent = true;
//
//         const data = await storage.getItem(`local:excalidraw-scene-${questionId}`, {
//             fallback: { elements: [], appState: {} }
//         });
//
//         console.log(data);
//
//
//         return data;
//     };
//
//
//     // const handleChange = async (excalidrawElements, appState, files) => {
//     //     if (excalidrawAPI && excalidrawElements.length) {
//     //         appState.collaborators = [];
//     //         const data = {excalidrawElements, appState, files};
//     //         await storage.setItem(`local:excalidraw-scene-${questionId}`, data);
//     //         console.log(data);
//     //     }
//     // };
//     //
//     // const saveScene = async () => {
//     //     if (excalidrawAPI) {
//     //         const elements = excalidrawAPI.getSceneElements();
//     //         const appState = {}; // Has problem with trying to access collaborators.
//     //
//     //         await storage.setItem(`local:excalidraw-scene-${questionId}`, {
//     //             elements,
//     //             appState
//     //         });
//     //         console.log("State Changed");
//     //     }
//     // };
//
//
//     return (
//         <div style={{height: "100vh", width: "100%"}}>
//             <Excalidraw
//                 excalidrawAPI={(api: ExcalidrawAPI): void => setExcalidrawAPI(api)}
//                 initialData={initialData}
//             />
//         </div>
//     );
// }
//
// export default App;


const STORAGE_KEY = `excalidraw-scene-${new URLSearchParams(window.location.search).get("id")}`;
const THEME_STORAGE_KEY = "excalidraw-theme";

const App = () => {
    const [excalidrawAPI, setExcalidrawAPI] = useState<ExcalidrawAPI | null>(null);
    const [initialData, setInitialData] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [lastSaveTime, setLastSaveTime] = useState(Date.now());
    const [theme, setTheme] = useState(THEME.LIGHT);

    useEffect(() => {
        const savedData = localStorage.getItem(STORAGE_KEY);
        if (savedData) {
            setInitialData(JSON.parse(savedData));
        }

        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme) {
            setTheme(savedTheme)
        } else {
            localStorage.setItem(THEME_STORAGE_KEY, THEME.LIGHT);
        }

        setIsInitialized(true);
    }, []);

    const onSave = useCallback((elements: any, appState: any, files: any) => {
        if (!isInitialized) return;
        if (!excalidrawAPI) return;
        if (elements.length === 0) return;
        if (Date.now() < lastSaveTime + 500) return; // Only save if it's been more than 500 milliseconds since last save.

        if (appState.theme !== theme) {
            setTheme(appState.theme);
            localStorage.setItem(THEME_STORAGE_KEY, appState.theme);
        }

        const localTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (localTheme !== theme) {
            setTheme(localTheme);
        }

        const saveData = {
            elements: excalidrawAPI.getSceneElements(),
            appState: {...appState, collaborators: []},
            files
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(saveData));
        console.log(`Drawing saved: ${elements.length} elements`);

        setLastSaveTime(Date.now());
    }, [isInitialized, lastSaveTime, theme, excalidrawAPI]);


    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <Excalidraw
                excalidrawAPI={(api: ExcalidrawAPI): void => setExcalidrawAPI(api)}
                initialData={initialData}
                onChange={onSave}
                theme={theme}
                UIOptions={{
                    canvasActions: {
                        toggleTheme: true,
                    },
                }}
            />
        </div>
    );
};


export default App;