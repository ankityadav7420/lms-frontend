"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getTestDetails, submitAnswer, nextQuestion } from "../../../utils/api";
import Question from "../../../components/Question";
import { Button, Typography, Box, CircularProgress } from "@mui/material";

export default function TestPage() {
  const [question, setQuestion] = useState(null);
  const [testId, setTestId] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(null);
  const router = useRouter();
  const params = useParams();
  // The route segment currently named [testId] actually carries the unique URL
  const uniqueURL = params.testId;

  useEffect(() => {
    const fetchInitialQuestion = async () => {
      try {
        const response = await getTestDetails(uniqueURL);
        const test = response.data?.data;

        // Save the real testId from the backend for subsequent API calls
        setTestId(test._id);

        // Total questions for this test (fallback to env/default if missing)
        const defaultTotal =
          Number(process.env.NEXT_PUBLIC_DEFAULT_QUESTION_COUNT) || 10;
        setTotalQuestions(test.totalQuestions || defaultTotal);

        // Use the last question from the populated questions array, if available
        const questions = test.questions || [];
        const lastEntry = questions[questions.length - 1];
        const initialQuestion = lastEntry?.questionId || null;

        setQuestion(initialQuestion);
        setCurrentQuestionNumber(questions.length || 1);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching initial question:", error);
        setQuestion(null);
      } finally {
        setLoading(false);
      }
    };

    if (uniqueURL) fetchInitialQuestion();
  }, [uniqueURL]);

  // Prevent user from navigating back while test is in progress
  useEffect(() => {
    const handlePopState = (event) => {
      // Always keep the user on the current test page until finished
      event.preventDefault?.();
      router.push(`/test/${params.testId}`);
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router, params.testId]);

  const handleSubmitAnswer = async () => {
    if (!testId || !question?._id) return;

    setLoading(true);
    try {
      const response = await submitAnswer(testId, question._id, answer);
      const payload = response.data;

      // If the test is completed, go to the result/summary page
      if (payload?.message === "Test completed") {
        router.push(`/test/${testId}/result`);
      } else {
        // Fetch the next question for this test
        const nextResponse = await nextQuestion(testId);
        const nextPayload = nextResponse.data?.data;
        setQuestion(nextPayload?.question || null);
        setAnswer("");
        setCurrentQuestionNumber((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      setQuestion(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4ecfb 100%)",
        py: 6,
      }}
    >
      {/* Top Progress Bar */}
      {totalQuestions && (
        <Box
          sx={{
            position: "sticky",
            top: 0,
            background: "white",
            zIndex: 10,
            boxShadow: 1,
            mb: 4,
          }}
        >
          <Box
            sx={{
              height: 6,
              background: "#e0e0e0",
            }}
          >
            <Box
              sx={{
                height: "100%",
                width: `${
                  (currentQuestionNumber / totalQuestions) * 100
                }%`,
                background: "linear-gradient(90deg,#1976d2,#42a5f5)",
                transition: "width 0.4s ease",
              }}
            />
          </Box>
        </Box>
      )}
  
      <Box maxWidth="lg" mx="auto" px={3}>
        {question ? (
          <Box
            sx={{
              display: "flex",
              gap: 4,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Left Info Panel */}
            <Box
              sx={{
                width: { xs: "100%", md: 260 },
                background: "rgba(255,255,255,0.8)",
                backdropFilter: "blur(10px)",
                borderRadius: 3,
                p: 3,
                boxShadow: 2,
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Test Progress
              </Typography>
  
              <Typography variant="body2" color="text.secondary">
                Question
              </Typography>
  
              <Typography variant="h4" fontWeight="bold" mt={1}>
                {currentQuestionNumber}
              </Typography>
  
              {totalQuestions && (
                <Typography variant="body2" mt={1}>
                  of {totalQuestions}
                </Typography>
              )}
  
              {totalQuestions && (
                <Typography
                  variant="caption"
                  display="block"
                  mt={2}
                  color="text.secondary"
                >
                  {Math.max(
                    totalQuestions - currentQuestionNumber + 1,
                    0
                  )} remaining
                </Typography>
              )}
            </Box>
  
            {/* Main Question Card */}
            <Box
              sx={{
                flex: 1,
                background: "white",
                borderRadius: 4,
                p: { xs: 3, md: 5 },
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                transition: "all 0.3s ease",
              }}
            >
              {/* Question Header */}
              <Box mb={4}>
                <Typography
                  variant="overline"
                  sx={{
                    background: "#e3f2fd",
                    color: "#1976d2",
                    px: 2,
                    py: 0.5,
                    borderRadius: 10,
                    fontWeight: 600,
                  }}
                >
                  Question {currentQuestionNumber}
                </Typography>
              </Box>
  
              {/* Question Component */}
              <Box>
                <Question
                  question={question}
                  answer={answer}
                  setAnswer={setAnswer}
                />
              </Box>
  
              {/* Submit Button */}
              <Box mt={5} textAlign="right">
                <Button
                  variant="contained"
                  size="large"
                  disabled={!answer || loading}
                  onClick={handleSubmitAnswer}
                  sx={{
                    px: 5,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    textTransform: "none",
                    boxShadow: "0 6px 18px rgba(25,118,210,0.3)",
                  }}
                >
                  {loading ? "Submitting..." : "Submit Answer"}
                </Button>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box textAlign="center" mt={10}>
            <Typography variant="h5" color="text.secondary">
              No question found
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
  
  // return (
  //   <Box maxWidth="md" margin="auto" padding={3}>
  //     {question ? (
  //       <Box display="flex" gap={3} alignItems="flex-start">
  //         {/* Left side: progress / pending questions info */}
  //         <Box minWidth={200}>
  //           <Typography variant="subtitle1" fontWeight="bold">
  //             Progress
  //           </Typography>
  //           <Typography variant="body2">
  //             Question {currentQuestionNumber}
  //             {totalQuestions
  //               ? ` of ${totalQuestions} (${Math.max(
  //                   totalQuestions - currentQuestionNumber + 1,
  //                   0
  //                 )} left)`
  //               : ""}
  //           </Typography>
  //         </Box>

  //         {/* Right side: current question */}
  //         <Box flex={1} textAlign="center">
  //           <Question question={question} answer={answer} setAnswer={setAnswer} />
  //           <Box mt={3}>
  //             <Button
  //               variant="contained"
  //               color="primary"
  //               onClick={handleSubmitAnswer}
  //               sx={{ px: 4 }}
  //             >
  //               Submit Answer
  //             </Button>
  //           </Box>
  //         </Box>
  //       </Box>
  //     ) : (
  //       <Typography variant="h6" textAlign="center">
  //         No question found
  //       </Typography>
  //     )}
  //   </Box>
  // );
}
