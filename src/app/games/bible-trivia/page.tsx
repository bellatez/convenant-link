
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Brain, CheckCircle, XCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TriviaQuestion {
  id: string;
  questionText: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
}

const sampleQuestions: TriviaQuestion[] = [
  {
    id: "q1",
    questionText: "Who was the first king of Israel?",
    options: [
      { id: "q1o1", text: "David" },
      { id: "q1o2", text: "Saul" },
      { id: "q1o3", text: "Solomon" },
      { id: "q1o4", text: "Samuel" },
    ],
    correctOptionId: "q1o2",
  },
  {
    id: "q2",
    questionText: "Which book comes after Genesis?",
    options: [
      { id: "q2o1", text: "Leviticus" },
      { id: "q2o2", text: "Numbers" },
      { id: "q2o3", text: "Exodus" },
      { id: "q2o4", text: "Deuteronomy" },
    ],
    correctOptionId: "q2o3",
  }
];

export default function BibleTriviaPage() {
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<TriviaQuestion | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    if (quizStarted && sampleQuestions.length > 0) {
      setCurrentQuestion(sampleQuestions[0]); // Start with the first question
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [quizStarted]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer) {
      setShowResult(true);
    }
  };
  
  const handleNextQuestion = () => {
    // For this placeholder, we'll just cycle or show a "quiz finished" message
    // In a real game, this would fetch the next question
    setShowResult(false);
    setSelectedAnswer(null);
    const currentIndex = sampleQuestions.findIndex(q => q.id === currentQuestion?.id);
    if (currentIndex !== -1 && currentIndex < sampleQuestions.length - 1) {
        setCurrentQuestion(sampleQuestions[currentIndex+1]);
    } else {
        setCurrentQuestion(null); // End of sample questions
        setQuizStarted(false); // Or show a summary screen
        alert("You've completed the sample questions!");
    }
  };


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">Bible Trivia Challenge</CardTitle>
            <Button variant="outline" asChild>
              <Link href="/games">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Games
              </Link>
            </Button>
          </div>
          <CardDescription>
            Test your knowledge of the Bible! Select a mode and start the challenge.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12 min-h-[400px] flex flex-col items-center justify-center">
          {!quizStarted && !currentQuestion && (
            <div className="flex flex-col items-center justify-center space-y-4">
              <Brain className="h-16 w-16 text-primary" />
              <p className="text-xl text-muted-foreground">
                Ready to test your Bible knowledge?
              </p>
              <Button onClick={handleStartQuiz} className="mt-4">
                Start Trivia Challenge
              </Button>
            </div>
          )}

          {quizStarted && currentQuestion && (
            <div className="w-full max-w-lg text-left space-y-6">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{currentQuestion.questionText}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={selectedAnswer || ""} onValueChange={setSelectedAnswer} disabled={showResult}>
                    {currentQuestion.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-secondary/50 transition-colors">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="flex-1 cursor-pointer">{option.text}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>
              {!showResult && (
                <Button onClick={handleSubmitAnswer} disabled={!selectedAnswer} className="w-full">
                  Submit Answer
                </Button>
              )}
              {showResult && (
                <Card className={`p-4 ${selectedAnswer === currentQuestion.correctOptionId ? 'bg-green-100 dark:bg-green-900/30 border-green-500' : 'bg-red-100 dark:bg-red-900/30 border-red-500'}`}>
                  <div className="flex items-center">
                    {selectedAnswer === currentQuestion.correctOptionId ? (
                      <CheckCircle className="h-6 w-6 text-green-700 dark:text-green-400 mr-2" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-700 dark:text-red-400 mr-2" />
                    )}
                    <p className={`text-lg font-semibold ${selectedAnswer === currentQuestion.correctOptionId ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}>
                      {selectedAnswer === currentQuestion.correctOptionId ? "Correct!" : "Incorrect."}
                    </p>
                  </div>
                  {selectedAnswer !== currentQuestion.correctOptionId && (
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                      The correct answer was: {currentQuestion.options.find(o => o.id === currentQuestion.correctOptionId)?.text}
                    </p>
                  )}
                  <Button onClick={handleNextQuestion} className="mt-4 w-full">
                    Next Question
                  </Button>
                </Card>
              )}
            </div>
          )}
           {quizStarted && !currentQuestion && (
             <p className="text-muted-foreground">Quiz finished or no more questions.</p>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
