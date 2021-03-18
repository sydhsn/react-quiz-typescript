import React, { useState } from 'react';
import { fetchQuizQuestions } from './API';
import { QuestionState, Difficulty } from './API';
import QuestionCard from './components/QuestionsCard';
// Styles
import { GlobalStyle, Wrapper } from './App.style';

export type AnswerObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
}

const App = () => {

  const TOTAL_QUESTION = 10;

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers, setUserAnswer] = useState<AnswerObject[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);


  const startTrivia = async () => {

    setLoading(true);
    setGameOver(false);
    const newQuestion = await fetchQuizQuestions(
      TOTAL_QUESTION,
      Difficulty.EASY
    )

    setQuestions(newQuestion);
    setScore(0);
    setUserAnswer([]);
    setNumber(0)
    setLoading(false);

  }

  const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!gameOver) {
      // user answer 
      const answer = e.currentTarget.value;
      // check answer againest correct answer
      const correct = questions[number].correct_answer === answer;
      // set score 
      if (correct) setScore(prev => prev + 1);
      // save answer in userAnswer array
      const answerObject = {
        question: questions[number].question,
        answer,
        correct,
        correctAnswer: questions[number].correct_answer
      };
      setUserAnswer(prev => [...prev, answerObject]);

    }
  }

  const nextQuestion = () => {
    // move to next question if the question number is not last
    const nextQuestion = number + 1;
    if (nextQuestion === TOTAL_QUESTION) {
      setGameOver(true);
    }
    else {
      setNumber(nextQuestion);
    }
  }



  return (
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>REACT QUIZ</h1>
        {gameOver || userAnswers.length === TOTAL_QUESTION ? (
          <button className='start' onClick={startTrivia}>
            Start
          </button>
        ) : null}
        {!gameOver ? <p className='score'>Score: {score}</p> : null}
        {loading ? <p>Loading Questions...</p> : null}
        {!loading && !gameOver && (
          <QuestionCard
            questionNr={number + 1}
            totalQuestions={TOTAL_QUESTION}
            question={questions[number].question}
            answers={questions[number].answers}
            userAnswer={userAnswers ? userAnswers[number] : undefined}
            callback={checkAnswer}
          />
        )}
        {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTION - 1 ? (
          <button className='next' onClick={nextQuestion}>
            Next Question
          </button>
        ) : null}
      </Wrapper>
    </>
  );
}

export default App;
