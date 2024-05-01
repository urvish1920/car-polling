"use client";
import { FormEvent, useState } from "react";
import styles from "./emailsend.module.css";
import TextField from "@mui/material/TextField/TextField";
import { BASE_URL } from "@/app/utils/apiutils";

export default function ApprovalRequest() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/auth/sendResetPasswordEmail`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
      } else {
        alert("Failed to change password");
        return;
      }
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
