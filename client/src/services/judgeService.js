import axios from "axios";

const JUDGE0_URL =
  "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true";

// ✅ Your RapidAPI Key (string)
const RAPIDAPI_KEY =
  "f59165b74emshebbcc10d5f819f3p10ce75jsn4ac2f2918bfb";

export const submitCode = async (source_code, language) => {
  // Judge0 uses numeric IDs for languages
  const languageMap = {
    java: 62, // Java (OpenJDK 13.0.1)
    cpp: 54, // C++ (GCC 9.2.0)
    c: 50, // C (GCC 9.2.0)
    python: 71, // Python (3.8.1)
    javascript: 63, // Node.js (12.14.0)
  };

  try {
    const response = await axios.post(
      JUDGE0_URL,
      {
        source_code,
        language_id: languageMap[language],
        stdin: "", // optional custom input
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
        },
      }
    );

    return {
      output: response.data.stdout,
      error: response.data.stderr || response.data.compile_output,
    };
  } catch (err) {
    console.error("Judge0 API error:", err.message);
    throw err;
  }
};
