"use client";
import React, { useEffect, useState } from "react";
import styles from './signIn.module.css';
import Link from "next/link";

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
      if (response.ok && response.status === 201) {
        window.location.href = "/";
      } else {
        console.log(response);
      }
    } catch (error: any) {
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
          <h1>{loading ? "Processing" : "SignIn"}</h1>
          <label>email</label>
          <input
            className={styles.inputField}
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="email"
          />
          <label>password</label>
          <input
            className={styles.inputField}
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="password"
          />

          <button className="input" onClick={onLogin} disabled={buttonDisabled}>
            {loading ? "Processing ..." : "Signin"}
          </button>
          <Link href="/signup" className={styles.signupLink}>
            signup page
          </Link>
        </div>
      </div>
    </div>
  );
}
