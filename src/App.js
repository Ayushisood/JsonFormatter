import { useState, useRef } from "react";
import { create, render } from "./Tree";

function App() {
  const [disabledBtn, setDisabledBtn] = useState(true);
  const [isError, setError] = useState("");
  const textRef = useRef(null);
  const outputRef = useRef(null);

  //display formatted json when format btn is clicked
  const handleFormat = () => {
    try {
      const formatted = JSON.stringify(
        JSON.parse(textRef.current.value),
        null,
        4
      );

      const tree = create(formatted);

      render(tree, outputRef.current);
    } catch (error) {
      setError(error.message);
      // outputRef.current.value = error;
    }
  };

  // clear data from both sections when clear btn is clicked
  const handleClear = () => {
    textRef.current.value = "";
    outputRef.current.removeChild(outputRef.current.firstChild);
    setDisabledBtn(true);
  };

  const handleChange = (event) => {
    if (event.target.value !== "") setDisabledBtn(false);
  };
  return (
    <div className="m-4 md:m-6 p-2 h-screen">
      <div className="flex items-center justify-center text-white font-semibold  p-2 mb-2 md:p-4">
        {/* Format btn */}
        <button
          className={`p-2 md:p-4 bg-green-600  m-2 rounded-md hover:bg-green-700 ${
            disabledBtn ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handleFormat}
          disabled={disabledBtn}
        >
          Format Json
        </button>
        {/* Clear btn */}
        <button
          className={`p-2 md:p-4 bg-red-600 m-2 rounded-md hover:bg-red-700 ${
            disabledBtn ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          onClick={handleClear}
          disabled={disabledBtn}
        >
          Clear Data
        </button>
      </div>

      <div className="grid gap-2 grid-cols-1 md:grid-cols-2 h-[80%]">
        {/* input section */}
        <textarea
          onChange={handleChange}
          ref={textRef}
          placeholder="Enter your Json data here"
          className="m-2 rounded-md p-4 bg-[#444444] text-yellow-600 outline-none resize-none focus:bg-[#4a4a4a]"
        ></textarea>
        {/* output section */}
        <div
          ref={outputRef}
          className="m-2  rounded-md p-4 bg-[#444444]  text-yellow-600  focus:bg-[#4a4a4a] overflow-y-auto"
        >
          {isError}
        </div>
      </div>
    </div>
  );
}

export default App;
