import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  createTheme,
  ThemeProvider,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Paper,
  TextField,
  Typography,
  Link,
  Grid,
} from "@mui/material";
import { userExists } from "../redux/reducer/auth";
import { useNavigate } from "react-router-dom";

// Custom hook for input validation
const useInputValidation = (initialValue, validator) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);

  const changeHandler = (e) => {
    setValue(e.target.value);
    if (validator) {
      const validationError = validator(e.target.value);
      setError(validationError);
    }
  };

  return { value, error, changeHandler };
};

// Main Login Component
function Login() {
  const defaultTheme = createTheme();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Input hooks
  const name = useInputValidation("");
  const username = useInputValidation("");
  const password = useInputValidation("");

  // Toggle login/signup form
  const toggleLogin = () => setIsLogin((prev) => !prev);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging In...");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/login`,
        { username: username.value, password: password.value },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const { success, user, message, role } = response.data;
      if (success) {
        dispatch(userExists(user));
        toast.success(message, { id: toastId });
        // navigate(role === "admin" ? "/admin-dashboard" : "/");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up
  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/signup`,
        {
          name: name.value,
          username: username.value,
          password: password.value,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const { success, message } = response.data;
      if (success) {
        toast.success(message, { id: toastId });
        toggleLogin(); // Switch to login after successful signup
      } else {
        toast.error("Signup failed", { id: toastId });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://www.hostpapa.com/blog/app/uploads/2023/05/Best-Chat-Apps-on-The-Internet-Header.jpg)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }} />
            <Typography component="h1" variant="h5">
              {isLogin ? "Sign In" : "Sign Up"}
            </Typography>
            <Box
              component="form"
              noValidate
              sx={{ mt: 1 }}
              onSubmit={isLogin ? handleLogin : handleSignUp}
            >
              {/* Show name field only during signup */}
              {!isLogin && (
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Name"
                  name="name"
                  autoFocus
                  value={name.value}
                  onChange={name.changeHandler}
                />
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoFocus={isLogin}
                value={username.value}
                onChange={username.changeHandler}
              />
              {username.error && (
                <Typography color="error" variant="caption">
                  {username.error}
                </Typography>
              )}
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password.value}
                onChange={password.changeHandler}
              />
              {password.error && (
                <Typography color="error" variant="caption">
                  {password.error}
                </Typography>
              )}
              {isLogin && (
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
              )}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={isLoading}
              >
                {isLogin ? "Sign In" : "Sign Up"}
              </Button>
              <Grid container>
                <Grid item>
                  <Link
                    disabled={isLoading}
                    onClick={toggleLogin}
                    style={{ cursor: "pointer" }}
                  >
                    {isLogin
                      ? "Don't have an account? Sign Up"
                      : "Already have an account? Sign in"}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

export default Login;
