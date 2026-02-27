"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getProfile, getCurrentUser } from "../../utils/api";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  CircularProgress
} from "@mui/material";

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [tests, setTests] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);

  // Initial load
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [profileRes, userRes] = await Promise.all([
          getProfile(1),
          getCurrentUser()
        ]);

        const profileData = profileRes.data?.data;
        const userData = userRes.data?.data;

        if (!profileData || !userData) {
          setLoadingInitial(false);
          return;
        }

        setProfile({ ...profileData, user: userData });
        setTests(profileData.recentTests || []);
        setHasMore(profileData.hasMore ?? false);
      } catch (e) {
        if (e?.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoadingInitial(false);
      }
    };

    fetchInitial();
  }, [router]);

  // Load more tests safely
  const loadMoreTests = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);

    try {
      const res = await getProfile(page + 1);
      const newTests = res.data?.data?.recentTests || [];
      const more = res.data?.data?.hasMore ?? false;

      if (newTests.length === 0) {
        setHasMore(false);
      } else {
        // Prevent duplicates
        setTests((prev) => {
          const existingIds = new Set(prev.map((t) => t._id));
          const filtered = newTests.filter((t) => !existingIds.has(t._id));
          return [...prev, ...filtered];
        });

        setPage((prev) => prev + 1);
        setHasMore(more);
      }
    } catch (err) {
      setHasMore(false);
    }

    setLoadingMore(false);
  };

  // Intersection Observer
  const lastRowRef = useCallback(
    (node) => {
      if (loadingMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreTests();
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [loadingMore, hasMore]
  );

  if (loadingInitial) {
    return (
      <Box height="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) return null;

  const { user, stats } = profile;

  return (
    <Box sx={{ background: "#f5f7fb", minHeight: "100vh", py: 5 }}>
      <Container maxWidth="lg">

        {/* Header */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight="bold">
            Welcome back, {user.name}
          </Typography>
          <Typography color="text.secondary">
            Track your performance and recent activity
          </Typography>
        </Box>
        <Grid container spacing={3} alignItems="stretch">
          <Grid item xs={12} md={4} display="flex">
            <Card
              elevation={3}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 140
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                  gutterBottom
                >
                  Total Tests
                </Typography>

                <Typography variant="h4" fontWeight="bold">
                  {stats.totalTests}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} display="flex">
            <Card
              elevation={3}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 140
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                  gutterBottom
                >
                  Completed Tests
                </Typography>

                <Typography variant="h4" fontWeight="bold">
                  {stats.completedTests}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4} display="flex">
            <Card
              elevation={3}
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: 140
              }}
            >
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center"
                }}
              >
                <Typography
                  color="text.secondary"
                  variant="subtitle2"
                  gutterBottom
                >
                  Role
                </Typography>

                <Chip
                  label={user.role}
                  color="primary"
                  sx={{ width: "fit-content" }}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Tests */}
        <Box mt={6}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Recent Tests
          </Typography>

          <Card elevation={3}>
            <TableContainer
              sx={{
                maxHeight: 450,
                overflowY: "auto"
              }}
            >
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Completed
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Score
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Attempted
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Total Questions
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      Date
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {tests.map((t, index) => {
                    const isLast = tests.length === index + 1;

                    return (
                      <TableRow
                        key={t._id}
                        ref={isLast ? lastRowRef : null}
                        hover
                      >
                        <TableCell>
                          <Chip
                            label={t.completed ? "Yes" : "No"}
                            color={t.completed ? "success" : "warning"}
                            size="small"
                          />
                        </TableCell>

                        <TableCell>{t.score}</TableCell>

                        <TableCell>
                          {t.attemptedQuestions ?? 0}
                        </TableCell>

                        <TableCell>{t.totalQuestions}</TableCell>

                        <TableCell>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {loadingMore && (
                <Box textAlign="center" py={2}>
                  <CircularProgress size={24} />
                </Box>
              )}

              {!hasMore && (
                <Box textAlign="center" py={2}>
                  <Typography variant="body2" color="text.secondary">
                    No more records
                  </Typography>
                </Box>
              )}
            </TableContainer>
          </Card>
        </Box>

      </Container>
    </Box>
  );
}