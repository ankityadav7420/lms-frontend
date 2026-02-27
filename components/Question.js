// components/Question.js
import {
  TextField,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Paper
} from "@mui/material";

export default function Question({ question, answer, setAnswer }) {
  if (!question) return null;

  const { text, options = [], answerType = "single" } = question;

  const handleSingleChange = (event) => {
    setAnswer(event.target.value);
  };

  const handleMultipleChange = (option) => {
    const current = Array.isArray(answer) ? answer : [];
    if (current.includes(option)) {
      setAnswer(current.filter((o) => o !== option));
    } else {
      setAnswer([...current, option]);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        textAlign: "left",
        borderRadius: 2,
        boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
      }}
    >
      <Typography variant="h6" gutterBottom fontWeight="bold">
        {text}
      </Typography>

      {answerType === "input" || options.length === 0 ? (
        <TextField
          label="Your Answer"
          variant="outlined"
          fullWidth
          value={typeof answer === "string" ? answer : ""}
          onChange={(e) => setAnswer(e.target.value)}
        />
      ) : answerType === "single" ? (
        <RadioGroup value={answer || ""} onChange={handleSingleChange}>
          {options.map((opt, idx) => (
            <FormControlLabel
              key={opt}
              value={opt}
              control={<Radio />}
              label={`${String.fromCharCode(65 + idx)}. ${opt}`}
            />
          ))}
        </RadioGroup>
      ) : (
        // multiple
        <Box>
          {options.map((opt, idx) => (
            <FormControlLabel
              key={opt}
              control={
                <Checkbox
                  checked={Array.isArray(answer) && answer.includes(opt)}
                  onChange={() => handleMultipleChange(opt)}
                />
              }
              label={`${String.fromCharCode(65 + idx)}. ${opt}`}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
}
