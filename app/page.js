"use client";

import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LoginIcon from "@mui/icons-material/Login";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { startTest } from "../utils/api";

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [testData, setTestData] = useState(null);

  const handleStartTest = async () => {
    try {
      setLoading(true);
      const response = await startTest();
      setTestData(response.data);
      router.push("/test");
    } catch (error) {
      console.error("Error starting test:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box textAlign="center" py={4}>
        <Typography variant="h3" color="primary" gutterBottom>
          LMS Portal
        </Typography>
        <Typography variant="h5" color="textSecondary">
          Empowering Learning for Everyone
        </Typography>
      </Box>

      <Box textAlign="center" py={6}>
        <Typography variant="h4" gutterBottom>
          Welcome to Your Learning Hub
        </Typography>
        <Typography variant="body1" color="textSecondary" mb={4}>
          Explore a world of knowledge with our personalized, adaptive learning
          tools.
        </Typography>
        <Box display="flex" justifyContent="center" gap={2} mt={3}>
          {isAuthenticated ? (
            <Button
              variant="contained"
              color="secondary"
              startIcon={<PlayArrowIcon />}
              onClick={handleStartTest}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Start Test"
              )}
            </Button>
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<LoginIcon />}
                href="/login"
              >
                Login
              </Button>
              <Button
                variant="outlined"
                color="primary"
                startIcon={<HowToRegIcon />}
                href="/register"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Box>

      {testData && (
        <Box py={6} textAlign="center">
          <Typography variant="h5">Test Data</Typography>
          <Typography variant="body1">{JSON.stringify(testData)}</Typography>
        </Box>
      )}

      <Box py={6} textAlign="center">
        <Typography variant="h5" gutterBottom>
          Our Key Features
        </Typography>
        <Grid container spacing={4} mt={2}>
          <Grid item xs={12} md={4}>
            <SchoolIcon color="primary" style={{ fontSize: 50 }} />
            <Typography variant="h6">Extensive Course Library</Typography>
            <Typography color="textSecondary">
              Access a variety of courses in different fields, designed by
              experts.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <AssessmentIcon color="primary" style={{ fontSize: 50 }} />
            <Typography variant="h6">Adaptive Testing</Typography>
            <Typography color="textSecondary">
              Challenge yourself with adaptive tests that match your learning
              pace.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <PersonIcon color="primary" style={{ fontSize: 50 }} />
            <Typography variant="h6">Personalized Profiles</Typography>
            <Typography color="textSecondary">
              Create your profile to track progress, scores, and achievements.
            </Typography>
          </Grid>
        </Grid>
      </Box>

      <Box
        py={4}
        textAlign="center"
        color="textSecondary"
        borderTop={1}
        borderColor="grey.300"
      >
        <Typography variant="body2">
          © 2024 LMS Portal | <a href="/terms">Terms</a> |{" "}
          <a href="/privacy">Privacy</a> | <a href="/contact">Contact Us</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default HomePage;
