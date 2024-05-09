"use client";
import React, { useState } from "react";
import "./Navbar.css";
import Image from "next/image";
import logoImage from "../assert/logo.png";
import profile from "../assert/avater.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const Navbar = () => {
  const pathname = usePathname();
  const [islogin, setIsLogin] = useState(pathname === "/signIn");
  const [isSignup, setIsSingup] = useState(pathname === "/signup");
  const [isSendemail, setSendEmail] = useState(pathname === "/emailsend");

  const user = useSelector((state: RootState) => state.auth.user);
  if (user?.IsAdmin) {
    return (
      <nav
        className="navbar"
        style={
          islogin || isSignup || isSendemail
            ? { display: "none" }
            : { display: "flex" }
        }
      >
        <div className="navbar-brand">
          <Image src={logoImage} alt="Logo" width={100} height={50} />
        </div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              href="/"
              className={`navLink ${pathname === "/" ? "active" : ""}`}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/allUser"
              className={`navLink ${
                pathname.startsWith("/allUser") ? "active" : ""
              }`}
            >
              All User
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/allPlanRide"
              className={`navLink ${
                pathname.startsWith("/allPlanRide") ? "active" : ""
              }`}
            >
              All Plan Ride
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/allRequest"
              className={`navLink ${
                pathname.startsWith("/allRequest") ? "active" : ""
              }`}
            >
              All Request
            </Link>
          </li>
        </ul>
        <div className="profile-circle">
          <Link href="/profile">
            <Image
              src={user.image || profile}
              alt="Profile"
              width={45}
              height={45}
              className="profile"
            />
          </Link>
        </div>
      </nav>
    );
  } else {
    return (
      <nav
        className="navbar"
        style={
          islogin || isSignup || isSendemail
            ? { display: "none" }
            : { display: "flex" }
        }
      >
        <div className="navbar-brand">
          <Image src={logoImage} alt="Logo" width={100} height={50} />
        </div>
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link
              href="/"
              className={`navLink ${
                pathname === "/" || pathname === "/findRide" ? "active" : ""
              }`}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/myRides"
              className={`navLink ${
                pathname.startsWith("/myRides") ? "active" : ""
              }`}
            >
              My Ride
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/publishNewCar"
              className={`navLink ${
                pathname.startsWith("/publishNewCar") ? "active" : ""
              }`}
            >
              Publish New Car
            </Link>
          </li>
          <li className="nav-item">
            <Link
              href="/planRide"
              className={`navLink ${
                pathname.startsWith("/planRide") ? "active" : ""
              }`}
            >
              Plan Ride
            </Link>
          </li>
        </ul>
        <div className="profile-circle">
          <Link href="/profile">
            <Image
              src={user?.image || profile}
              alt="Profile"
              width={45}
              height={45}
              className="profile"
            />
          </Link>
        </div>
      </nav>
    );
  }
};

export default Navbar;
