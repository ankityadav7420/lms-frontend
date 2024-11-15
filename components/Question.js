// components/Question.js
import { TextField, Typography, Box } from "@mui/material";

export default function Question({ question, answer, setAnswer }) {
  if (!question) return null;

  return (
    <Box my={2}>
      <Typography variant="h6" gutterBottom>
        {question.text}
      </Typography>
      <TextField
        label="Your Answer"
        variant="outlined"
        fullWidth
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />
    </Box>
  );
}
