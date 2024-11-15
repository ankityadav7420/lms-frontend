"use client";

import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Link,
  Box
} from "@mui/material";
import { registerUser } from "../../utils/api";
import { useRouter } from "next/navigation";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: ""
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await registerUser(
        formData.email,
        formData.name,
        formData.password
      );
      console.log("Registration successful:", response.data);
      router.push("/login");
    } catch (err) {
      setError("Registration failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Name"
          name="name"
          fullWidth
          margin="normal"
          value={formData.name}
          onChange={handleChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={formData.password}
          onChange={handleChange}
        />
        <Button variant="contained" color="primary" fullWidth type="submit">
          Register
        </Button>
      </form>
      <Box textAlign="center" mt={2}>
        <Typography variant="body2">
          Already have an account?{" "}
          <Link href="/login" underline="hover" color="primary">
            Login
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;
