"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getTestResult } from "../../../../utils/api";
import { Box, Typography, Button, CircularProgress, Paper } from "@mui/material";

export default function TestResultPage() {
  const params = useParams();
  const router = useRouter();
  const testId = params.testId;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [test, setTest] = useState(null);

  useEffect(() => {
    const fetchResult = async () => {
      if (!testId) return;
      setLoading(true);
      setError("");
      try {
        const response = await getTestResult(testId);
        const payload = response.data?.data;
        if (!payload) {
          setError("Unable to load test summary.");
        } else {
          setTest(payload);
        }
      } catch (err) {
        console.error("Error fetching test result:", err);
        setError("Error fetching test summary.");
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

  if (error) {
    return (
      <Box maxWidth="sm" margin="auto" padding={3} textAlign="center">
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => router.push("/")}>
          Go Home
        </Button>
      </Box>
    );
  }

  const totalQuestions = test?.totalQuestions || 0;
  const answeredCount = test?.questions?.length || 0;
  const remainingCount = Math.max(totalQuestions - answeredCount, 0);
  const score = test?.score ?? 0;

  return (
    <Box maxWidth="md" margin="auto" padding={3}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Test Summary
        </Typography>

        <Box
          display="flex"
          justifyContent="space-around"
          flexWrap="wrap"
          mb={3}
        >
          <Box textAlign="center" m={1}>
            <Typography variant="h6">Total Questions</Typography>
            <Typography variant="h5" color="primary">
              {totalQuestions}
            </Typography>
          </Box>
          <Box textAlign="center" m={1}>
            <Typography variant="h6">Attempted</Typography>
            <Typography variant="h5" color="primary">
              {answeredCount}
            </Typography>
          </Box>
          <Box textAlign="center" m={1}>
            <Typography variant="h6">Remaining</Typography>
            <Typography variant="h5" color="primary">
              {remainingCount}
            </Typography>
          </Box>
          <Box textAlign="center" m={1}>
            <Typography variant="h6">Final Score</Typography>
            <Typography variant="h5" color="secondary">
              {score}
            </Typography>
          </Box>
        </Box>

        <Box mt={2} mb={3}>
          <Typography variant="subtitle1" color="textSecondary">
            Score calculation:
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Your score is calculated as the sum of the difficulty values for each
            question you answered correctly. Each correct answer adds that
            question&apos;s difficulty points to your total score; incorrect answers do
            not add any points.
          </Typography>
        </Box>

        <Box textAlign="center" mt={3}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => router.push("/")}
          >
            Back to Home
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

