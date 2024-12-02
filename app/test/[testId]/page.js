"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTestDetails, nextQuestion, submitAnswer } from "../../../utils/api";
import Question from "../../../components/Question";
import { Button, Typography, Box, CircularProgress } from "@mui/material";

export default function TestPage() {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const testId = params.testId;

  useEffect(() => {
    const fetchInitialQuestion = async () => {
      try {
        const response = await getTestDetails(testId);

        setQuestion(response.data.question);
      } catch (error) {
        console.error("Error fetching initial question:", error);
      } finally {
        setLoading(false);
      }
    };

    if (testId) fetchInitialQuestion();
  }, [testId]);

  const handleSubmitAnswer = async () => {
    setLoading(true);
    try {
      const response = await submitAnswer(testId, question.id, answer);
      if (response.data.message === "Test completed") {
        router.push(`/test/${testId}/result`);
      } else {
        const nextQuestion = await nextQuestion(testId);
        setQuestion(nextQuestion.data.question);
        setAnswer("");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="sm" margin="auto" padding={3} textAlign="center">
      {question ? (
        <>
          <Question question={question} answer={answer} setAnswer={setAnswer} />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitAnswer}
          >
            Submit Answer
          </Button>
        </>
      ) : (
        <Typography variant="h6">Loading Question...</Typography>
      )}
    </Box>
  );
}
