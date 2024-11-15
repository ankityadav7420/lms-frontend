"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getTestDetails, submitAnswer } from "../../../utils/api";
import Question from "../../../components/Question";
import { Button, Typography, Box, CircularProgress } from "@mui/material";

export default function TestPage({ params }) {
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { testId } = params;

  useEffect(() => {
    const fetchTestDetails = async () => {
      try {
        const initialQuestion = await getTestDetails(testId);
        setQuestion(initialQuestion);
      } finally {
        setLoading(false);
      }
    };
    fetchTestDetails();
  }, [testId]);

  const handleSubmitAnswer = async () => {
    setLoading(true);
    try {
      const nextQuestion = await submitAnswer(testId, question.id, answer);
      if (nextQuestion) {
        setQuestion(nextQuestion);
        setAnswer("");
      } else {
        router.push(`/test/${testId}/result`);
      }
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
