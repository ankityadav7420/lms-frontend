"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Button,
  Box,
  Typography,
  CircularProgress
} from "@mui/material";
import Question from "./Question";
import { startTest, submitAnswer } from "../utils/api";

const TestPage = () => {
  const router = useRouter();
  const [testData, setTestData] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);

  useEffect(() => {
    const fetchTestData = async () => {
      setLoading(true);
      try {
        const response = await startTest();
        setTestData(response.data);
      } catch (error) {
        console.error("Error fetching test data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTestData();
  }, []);

  const handleAnswerSubmit = async () => {
    if (!answer) return;
    setLoading(true);

    try {
      const response = await submitAnswer(
        testData.testId,
        testData.question._id,
        answer
      );
      if (response.data.nextQuestion) {
        setTestData({ ...testData, question: response.data.nextQuestion });
        setScore(response.data.score);
        setAnswer("");
      } else if (response.data.message === "Test is already completed") {
        setScore(response.data.score);
        setTestData(null);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" py={4}>
        <Typography variant="h4">Adaptive Test</Typography>
        {loading && <CircularProgress />}
      </Box>

      {testData && testData.question && (
        <Question
          question={testData.question}
          answer={answer}
          setAnswer={setAnswer}
        />
      )}

      {testData && testData.question && (
        <Box textAlign="center" mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAnswerSubmit}
            disabled={loading || !answer}
          >
            {loading ? <CircularProgress size={24} /> : "Submit Answer"}
          </Button>
        </Box>
      )}

      {score !== null && (
        <Box textAlign="center" py={4}>
          <Typography variant="h5">Your final score is: {score}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/")}
          >
            Return to Home
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default TestPage;
