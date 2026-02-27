"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCourses } from "../../utils/api";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button
} from "@mui/material";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCourses();
        setCourses(res.data?.data || []);
      } catch (e) {
        console.error("Error loading courses", e);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Extensive Course Library
      </Typography>
      <Typography variant="body1" color="textSecondary" align="center" mb={4}>
        Access a variety of courses in different fields, designed by experts.
      </Typography>

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course._id}>
            <Card
              sx={{ height: "100%", cursor: "pointer" }}
              onClick={() => router.push(`/courses/${course._id}`)}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {course.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  paragraph
                  sx={{ minHeight: 60 }}
                >
                  {course.description}
                </Typography>
                <Box display="flex" justifyContent="space-between" mt={1}>
                  <Chip label={course.category} size="small" />
                  <Chip label={course.level} size="small" color="primary" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {!loading && courses.length === 0 && (
          <Grid item xs={12}>
            <Box textAlign="center" mt={4}>
              <Typography gutterBottom>
                No courses available yet. Please check back later.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push("/")}
              >
                Back to Home
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

