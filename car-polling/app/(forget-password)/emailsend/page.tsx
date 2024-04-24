"use client";
import { FormEvent, useState } from "react";
import styles from "./emailsend.module.css";
import TextField from "@mui/material/TextField/TextField";

export default function ApprovalRequest() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "http://localhost:8000/auth/sendResetPasswordEmail",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );
      console.log(response);
      if (!response.ok) {
        alert("Failed to change password");
        return;
      }
      alert("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      alert(error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.main_container}>
        <div className={styles.heading_sendmail}>send Mail</div>
        <form onSubmit={handleSubmit} className={styles.fromContain}>
          <label className={styles.label_text}>Enter Email Address</label>
          <TextField
            className={styles.inputField_email}
            name="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <div className={styles.buttons}>
            <button type="submit" className={styles.sendMailBtn}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
