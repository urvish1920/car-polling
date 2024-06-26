"use client";
import styles from "./approvalRequest.module.css";
import Image from "next/image";
import profileImage from "../../../assert/avater.png";
import { useSelector } from "react-redux";
import { useState } from "react";
import { BASE_URL } from "@/app/utils/apiutils";

export default function ApprovalRequest({
  params,
}: {
  params: { approvalUser: string };
}) {
  const id = params.approvalUser;
  console.log(id);
  const ride = useSelector((state: any) => state.PlanRide.rides);
  const request = useSelector((state: any) => state.RequestUser.request);
  const filteredRequests = request.filter((req: any) => req._id === id);
  const [buttondisable, setButtondisable] = useState(false);

  console.log(filteredRequests[0]);

  const handleApproval = async (approvalStatus: string) => {
    if (approvalStatus === "decline") {
      try {
        const response = await fetch(`${BASE_URL}/request/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status_Request: approvalStatus,
          }),
        });
        const data = await response.json();
        if (!response.ok) {
          alert(data.message);
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          alert(data.message);
          setButtondisable(true);
        }
      } catch (error: any) {
        console.error("Signup failed:", error.message);
      }
    } else {
      if (ride.leftSites >= filteredRequests[0].passenger) {
        try {
          const response = await fetch(`${BASE_URL}/request/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              status_Request: approvalStatus,
            }),
          });
          const data = await response.json();
          if (!response.ok) {
            alert(data.message);
            throw new Error(`Server responded with status ${response.status}`);
          } else {
            alert(data.message);
            setButtondisable(true);
          }
        } catch (error: any) {
          console.error("Signup failed:", error.message);
        }
        const newleftsites = ride.leftSites - filteredRequests[0].passenger;
        const newOccupation = [...ride.occupation, filteredRequests[0]];
        try {
          const response = await fetch(`${BASE_URL}/rides/${ride._id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              leftSites: newleftsites,
              occupation: newOccupation,
            }),
          });
          const data = await response.json();
          if (!response.ok) {
            alert(data.message);
            throw new Error(`Server responded with status ${response.status}`);
          } else {
            alert(data.message);
            setButtondisable(true);
          }
        } catch (error: any) {
          console.error("Signup failed:", error.message);
        }
      } else {
        alert(
          `In your car sites is full passanger is ${filteredRequests[0].passenger} left sites is ${ride.leftSites}`
        );
        setButtondisable(true);
      }
    }
  };

  return (
    <div>
      <h1 className={styles.heading}>Booking Plan</h1>
      <div className={styles.otcenter}>
        <div className={styles.outercontainer}>
          <div className={styles.first_container}>
            <div className={styles.space_between}>
              <div className={styles.username}>
                {filteredRequests[0].user.user_name.charAt(0).toUpperCase() +
                  filteredRequests[0].user.user_name.slice(1)}
              </div>
              <div className={styles.img}>
                <Image
                  src={filteredRequests[0].user.image || profileImage}
                  className={styles.avater}
                  width={70}
                  height={70}
                  alt="Profile Avatar"
                />
              </div>
            </div>
          </div>
          <div className={styles.second_container}>
            <div className={styles.linebetween} />
            <div className={styles.space_between}>
              <div className={styles.price_text}>1 seat</div>
              <div className={styles.price}>&#8377;{ride.price}</div>
            </div>
            <div className={styles.space_between}>
              <div className={styles.leftsites}>
                left sites: {ride.leftSites} no of passanger:
                {filteredRequests[0].passenger}
              </div>
            </div>
          </div>
          <div className={styles.third_container}>
            <div className={styles.linebetween} />
            <button
              className={styles.approveButton}
              onClick={() => handleApproval("Approve")}
              disabled={buttondisable}
            >
              Approve
            </button>
            <button
              className={styles.declineButton}
              onClick={() => handleApproval("Decline")}
              disabled={buttondisable}
            >
              Decline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
