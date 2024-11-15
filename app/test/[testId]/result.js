// test/[testId]/result.js
"use client";
import { useEffect, useState } from "react";
import { getResult } from "../../../utils/api";
import { useRouter } from "next/navigation";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

export default function ResultPage({ params }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { testId } = params;

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getResult(testId);
        setResult(data);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [testId]);

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
    <Box maxWidth="md" margin="auto" padding={4} textAlign="center">
      <Typography variant="h4" color="primary" gutterBottom>
        Test Results
      </Typography>
      <Typography variant="h6" color="textSecondary">
        Score: {result.score} / {result.totalQuestions}
      </Typography>
      <Box my={4}>
        {result.details.map((item, index) => (
          <Box key={index} p={2} mb={2} border={1} borderRadius={2}>
            <Typography variant="body1">Question: {item.question}</Typography>
            <Typography variant="body2" color={item.correct ? "green" : "red"}>
              Your Answer: {item.answer}{" "}
              {item.correct ? "(Correct)" : "(Incorrect)"}
            </Typography>
          </Box>
        ))}
      </Box>
      <Button
        variant="contained"
        color="primary"
        onClick={() => router.push("/")}
      >
        Back to Home
      </Button>
    </Box>
  );
}
