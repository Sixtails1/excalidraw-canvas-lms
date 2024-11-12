function App() {
	const [error, setError] = useState(false);

	const handleButtonClick = (command: string): void => {
		browser.tabs.query({ active: true, currentWindow: true })
        .then((tabs) => {
            browser.tabs.sendMessage(tabs[0].id!, { command: command });
		})
	};

	return (
		<>
			<div id="popup-content" className="p-6 mx-auto">
				<h1>Excalidraw in Canvas</h1>
				{!error && (
					<div id="popup-buttons">
						<button
							onClick={() => handleButtonClick("inject")}
							className="text-white bg-blue-600 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 m-2"
						>
							Inject
						</button>
						<button
							type="reset"
							onClick={() => handleButtonClick("reset")}
							className="text-white bg-red-600 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 m-2"
						>
							Reset
						</button>
						<button
							onClick={() => handleButtonClick("hideContent")}
							className="text-white bg-green-600 hover:bg-green-800 font-medium rounded-lg text-sm px-5 py-2.5 m-2"
						>
							Hide Content
						</button>
					</div>
				)}
				{error && (
					<div id="popup-error-content">
						<p>An error occurred.</p>
					</div>
				)}
			</div>
		</>
	);
}

export default App;
