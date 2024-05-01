"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./newPassword.module.css";
import TextField from "@mui/material/TextField/TextField";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import IconButton from "@mui/material/IconButton/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { BASE_URL } from "@/app/utils/apiutils";

export default function forgetPassword() {
  const [changePassword, setChangePassword] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [userId, setUserId] = useState("");
  console.log(userId);
  const [passwordValid, setPasswordValid] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    const parts = currentUrl.split("/");
    const id = parts[parts.length - 2];
    const token = parts[parts.length - 1];
    const fetchRides = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/auth/userverify/${id}/${token}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!response.ok) {
          alert(data.message);
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          setUserId(data.userId);
          if (data.message) {
            setIsVerified(true);
            alert(data.message);
          }
        }
      } catch (error) {
        alert(error);
        console.error("Error fetching data:", error);
      }
    };
    fetchRides();
  }, []);

  const validatePassword = (password: string, fieldName: string) => {
    if (fieldName === "newPassword") {
      const passwordRegex =
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
      setPasswordValid(passwordRegex.test(password));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setChangePassword((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    validatePassword(value, name);
  };

  const handleTogglePassword = (field: keyof typeof showPassword) => {
    setShowPassword((prevShowPassword) => ({
      ...prevShowPassword,
      [field]: !prevShowPassword[field],
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!userId) {
        throw new Error("User ID is not defined");
      }

      const response = await fetch(`${BASE_URL}/auth/resetPassword/${userId}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword: changePassword.newPassword }),
      });
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to change password");
      }
      alert("Password changed successfully!");
      window.location.href = "/signIn";
    } catch (error: any) {
      console.error("Error changing password:", error);
      alert(error.message || "An error occurred while changing password");
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <div className={styles.main_container}>
          <div className={styles.heading_changePassword}>New Password</div>
          <div className={styles.mustContain}>
            It must have at least 6 characters, 1 letter, 1 number, and 1
            special character
            <form onSubmit={handleSubmit}>
              <TextField
                className={styles.inputFieldChgPassword}
                label="New Password"
                name="newPassword"
                type={showPassword.newPassword ? "text" : "password"}
                value={changePassword.newPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleTogglePassword("newPassword")}
                      >
                        {showPassword.newPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <div
                className={
                  passwordValid
                    ? `${styles.passwordMessage} ${styles.strong}`
                    : `${styles.passwordMessage} ${styles.week}`
                }
              >
                {passwordValid ? "strong Password" : "week Password"}
              </div>
              <TextField
                className={styles.inputFieldChgPassword}
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword.confirmPassword ? "text" : "password"}
                value={changePassword.confirmPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => handleTogglePassword("confirmPassword")}
                      >
                        {showPassword.confirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <div className={styles.buttons}>
                <button
                  type="submit"
                  className={styles.changePasswordBtn}
                  disabled={!isVerified}
                >
                  New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
