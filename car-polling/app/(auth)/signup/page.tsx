"use client"
import React, { useEffect, useState } from "react";
import styles from "./signup.module.css";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import car_bg from "../../assert/bg_car_publiser.svg";
import { BASE_URL } from "@/app/utils/apiutils";

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
  const [passwordValid, setPasswordValid] = useState<boolean>(false);

  const onSignup = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        throw new Error(`Server responded with status ${response.status}`);
      }
      if (response.ok) {
        router.push("/signIn");
      }
    } catch (error: any) {
      alert(error.message);
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
  }, [user]);

  useEffect(() => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
    setPasswordValid(passwordRegex.test(user.password));
  }, [user.password]);

  return (
    <div className={styles.mainconatiner}>
      <div className={styles.text_publishNewRide}>
        Ditch the solo drive, share the ride & Save Money, save the planet!
      </div>
      <div className={styles.signupInnerContainer}>
        <div className={styles.signupInsideItem}>
          <h1 className={styles.headingSignUp}>
            {loading ? "Processing ..." : "signup"}
          </h1>
          <label className={styles.label_text}>Enter your Username</label>
          <input
            className={styles.inputField}
            id="username"
            type="text"
            value={user.user_name}
            onChange={(e) => setUser({ ...user, user_name: e.target.value })}
            placeholder="username"
          />
          <label className={styles.label_text}>Enter your Email</label>
          <input
            className={styles.inputField}
            id="email"
            type="text"
            value={user.email}
            onChange={(e) => setUser({ ...user, email: e.target.value })}
            placeholder="email"
          />
          <label className={styles.label_text}>
            Enter your Password
          </label>
          <input
            className={styles.inputField}
            id="password"
            type="password"
            value={user.password}
            onChange={(e) => setUser({ ...user, password: e.target.value })}
            placeholder="password"
          />
           <span
              className={passwordValid ? styles.green : styles.red}
            >
             6+ chars, 1 letter, 1 number, 1 special
            </span>
          <button
            className={styles.button_SignUp}
            onClick={onSignup}
            disabled={buttonDisabled || !passwordValid}
          >
            {loading ? "Processing ..." : "Signup"}
          </button>
          <Link href="/signIn" className={styles.signUpLink}>
            have an account? <span className={styles.bold_text}>Login</span>
          </Link>
        </div>
      </div>
      <div className={styles.car_img}>
        <Image
          src={car_bg}
          className={styles.publish_carbg}
          width={700}
          height={500}
          alt={`Picture of car`}
        />
      </div>
      <div className={styles.bt_text}>Drive.Share.Save</div>
    </div>
  );
}
