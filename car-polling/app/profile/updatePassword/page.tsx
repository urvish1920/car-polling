"use client";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import styles from "./updatePassword.module.css";
import { ChangeEvent, FormEvent, useState } from "react";
import { BASE_URL } from "@/app/utils/apiutils";

export default function ApprovalRequest() {
  const [changePassword, setChangePassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [passwordValid, setPasswordValid] = useState(false);

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

    const { newPassword } = changePassword;
    const passwordRegex =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      alert(
        "Password must have at least 6 characters, 1 letter, 1 number, and 1 special character."
      );
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/auth/changePassword`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          oldPassword: changePassword.oldPassword,
          newPassword: changePassword.newPassword,
        }),
      });
      console.log(response);
      if (!response.ok) {
        alert("Failed to change password.");
        return;
      }
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      alert("An error occurred while changing password.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main_container}>
        <div className={styles.heading_changePassword}>Change Password</div>
        <div className={styles.mustContain}>
          It must have at least 6 characters, 1 letter, 1 number, and 1 special
          character
          <form onSubmit={handleSubmit}>
            <TextField
              className={styles.inputFieldChgPassword}
              label="Old Password"
              name="oldPassword"
              type={showPassword.oldPassword ? "text" : "password"}
              value={changePassword.oldPassword}
              onChange={handleChange}
              fullWidth
              margin="normal"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => handleTogglePassword("oldPassword")}
                    >
                      {showPassword.oldPassword ? (
                        <VisibilityOff />
                      ) : (
                        <Visibility />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
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
              <button type="submit" className={styles.changePasswordBtn}>
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
