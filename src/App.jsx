import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
 
  const generateImage = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-3.5-large",
        {
          inputs: prompt,
        },
        {
          headers: {
            Authorization: `Bearer ${
              import.meta.env.VITE_HUGGING_FACE_API_KEY
            }`,
            "Content-Type": "application/json",
          },
          responseType: "blob",
        }
      );

      const imageURL = URL.createObjectURL(response.data);
      setImage(imageURL);
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };
  const downloadImage = () => {
    if (image) {
      const link = document.createElement("a");
      link.href = image;
      link.download = "generated-image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <>
      <div className="app">
        <h1>AI Image-Generator</h1>
        <input
          type="text"
          placeholder="Enter The Description"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              generateImage(); 
            }
          }}
        />
        <button onClick={generateImage} disabled={loading} className="buttonOne">
          {loading ? "Generating..." : "Generate Image"}
        </button>
        {image && (
          <div
            className="imgDiv"
           >
            <h2>Generated Image</h2>
            <img src={image} alt=""/>
            <button onClick={downloadImage} className="buttonTwo">
              Download Image
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
