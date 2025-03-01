//
//
//
// export const saveToLocalStorage = (
//     elements: readonly ExcalidrawElement[],
//     appState: AppState,
// ) => {
//     try {
//         localStorage.setItem(
//             STORAGE_KEYS.LOCAL_STORAGE_ELEMENTS,
//             JSON.stringify(clearElementsForLocalStorage(elements)),
//         );
//         localStorage.setItem(
//             STORAGE_KEYS.LOCAL_STORAGE_APP_STATE,
//             JSON.stringify(clearAppStateForLocalStorage(appState)),
//         );
//     } catch (error) {
//         // Unable to access window.localStorage
//         console.error(error);
//     }
// };
