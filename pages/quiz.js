import QuizPage from '../src/components/QuizPage';

export default function Quiz({ onProgressChange, quizMode }) {
  return <QuizPage onProgressChange={onProgressChange} quizMode={quizMode} />;
}
