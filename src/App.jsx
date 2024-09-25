import React, { useState, useEffect, useCallback } from "react";
import periodicTableData from "./periodicTableData";

function App() {
  const [quizElement, setQuizElement] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [correctAnswer, setCorrectAnswer] = useState(null);

  const getRandomElement = (data) => {
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
  };

  // Memoize generateOptions using useCallback
  const generateOptions = useCallback((correctElement) => {
    const options = new Set();
    options.add(correctElement);

    while (options.size < 4) {
      const randomElement = getRandomElement(periodicTableData);
      options.add(randomElement);
    }

    return Array.from(options).sort(() => 0.5 - Math.random());
  }, []);

  // Memoize generateNewQuestion and include generateOptions in its dependency array
  const generateNewQuestion = useCallback(() => {
    const randomElement = getRandomElement(periodicTableData);
    const randomOptions = generateOptions(randomElement);
    setQuizElement(randomElement);
    setOptions(randomOptions);
    setSelectedAnswer(null);
    setCorrectAnswer(null);
  }, [generateOptions]); // generateOptions is now a dependency

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
    setCorrectAnswer(quizElement);
  };

  useEffect(() => {
    generateNewQuestion();
  }, [generateNewQuestion]); // generateNewQuestion is memoized, safe to include

  const buttonColor = selectedAnswer
    ? selectedAnswer.name === correctAnswer.name
      ? "bg-green-500 hover:bg-green-700"
      : "bg-red-500 hover:bg-red-700"
    : "";

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-gray-800">Quiz : Tableau Périodique</h1>
      </header>

      <div className="max-w-md mx-auto h-full bg-white shadow-lg rounded-lg p-6 mt-[5%]">
        {!selectedAnswer && quizElement && (
          <div>
            <h2 className="text-2xl font-bold mb-4">
              Quel est le nom de l'élément pour le symbole <span className="text-white font-semibold rounded px-2 py-1 mx-2" style={{ backgroundColor: quizElement.color }}>{quizElement.symbol}</span> ?
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {options.map((option) => (
                <button
                  key={option.number} // Use a unique key
                  className={`bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 w-full`}
                  onClick={() => handleAnswerClick(option)}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedAnswer && correctAnswer && (
          <div className="mt-6">
            {selectedAnswer.name === correctAnswer.name ? (
              <h2 className="text-2xl font-bold text-green-600">Correct ! 🎉</h2>
            ) : (
              <h2 className="text-2xl font-bold text-red-600">Incorrect ! 😞</h2>
            )}

            <div className="mt-4">
              <h3 className="text-xl font-bold">Informations sur l'élément :</h3>
              <p><strong>Nom :</strong> {correctAnswer.name}</p>
              <p><strong>Symbole :</strong> {correctAnswer.symbol}</p>
              <p><strong>Numéro Atomique :</strong> {correctAnswer.number}</p>
              <p><strong>Masse Atomique :</strong> {correctAnswer.atomic_mass}</p>
              <p><strong>Catégorie :</strong> {correctAnswer.category}</p>
            </div>

            <button
              className={`mt-6 text-white font-semibold py-2 px-4 rounded ${buttonColor} w-full`}
              onClick={generateNewQuestion}
            >
              Question Suivante
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
