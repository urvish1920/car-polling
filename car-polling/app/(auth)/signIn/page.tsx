"use client";
import React, { useEffect, useState } from "react";
import styles from "./signIn.module.css";
import Link from "next/link";
import { setUserAndToken } from "../../redux/slice/userDataReducer";
import { AppDispatch } from "@/app/redux/store";
import { useDispatch } from "react-redux";

interface User {
  email: string;
  password: string;
}

export default function signIn() {
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [buttonDisabled, setButtonDisable] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const onLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/auth/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (response.ok) {
        const { access_token, user } = data;
        if (access_token && user) {
          dispatch(setUserAndToken({ user, token: access_token }));
          if (user.IsAdmin) {
            window.location.href = "/Admin";
          } else {
            window.location.href = "/";
          }
        } else {
          console.log("Token or user data not found in response");
        }
      } else {
        alert(data.message);
        console.log("Login failed", response.statusText);
      }
    } catch (error: any) {
      alert(error.message);
      console.log("Login failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [user]);

  return (
    <div className={styles.mainconatiner}>
      <div className={styles.loginInnerContainer}>
        <div className={styles.insideContainLogin}>
          <h1 className={styles.headingSignIn}>
            {loading ? "Processing" : "SignIn"}
          </h1>
          <label className={styles.label_text}>Enter your Email</label>
          <input
            className={styles.inputField}
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="email"
          />
          <label className={styles.label_text}>Enter Your password</label>
          <input
            className={styles.inputField}
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="password"
          />
          <Link href="/emailsend" className={styles.forgetPassword}>
            forget Password?
          </Link>
          <button
            className={styles.button_SignIn}
            onClick={onLogin}
            disabled={buttonDisabled}
          >
            {loading ? "Processing ..." : "Signin"}
          </button>
          <Link href="/signup" className={styles.signupLink}>
            Not have an account?{" "}
            <span className={styles.bold_text}>Register</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
