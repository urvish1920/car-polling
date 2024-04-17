"use client";
import "../../globals.css";
import React, { useEffect, useState } from "react";
import styles from './signup.module.css';
import Link from "next/link";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  password: string;
  user_name: string;
}

export default function signup() {
  const router = useRouter();
  const [user, setUser] = useState<User>({
    email: "",
    password: "",
    user_name: "",
  });
  const [buttonDisabled, setButtonDisable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const onSignup = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      if (response.ok) {
        router.push("/signIn");
      }
    } catch (error: any) {
      console.error("Signup failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.user_name.length > 0
    ) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
    const hasWhiteSpace = /\s/.test(user.password);
    if (hasWhiteSpace) {
      alert("there are whitespace in password");
      setButtonDisable(false);
    }
  }, [user]);

  return (
    <div className={styles.mainconatiner}>
      <div className={styles.signupInnerContainer}>
        <div className={styles.signupInsideItem}>
          <h1>{loading ? "Processing ..." : "signup"}</h1>
          <label>username</label>
          <input
            className={styles.inputField}
            id="username"
            type="text"
            value={user.user_name}
            onChange={(e) => setUser({ ...user, user_name: e.target.value })}
            placeholder="username"
          />
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

          <button onClick={onSignup} disabled={buttonDisabled}>
            {loading ? "Processing ..." : "Signup"}
          </button>
          <Link href="/signin" className={styles.loginLink}>
            SignIn page
          </Link>
        </div>
      </div>
    </div>
  );
}
