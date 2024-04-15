"use client";
import styles from "./findRideSummary.module.css";
import FormattedDate from "@/app/component/Formate";
import { RootState } from "@/app/redux/store";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function SummaryFindRide() {
  const ride = useSelector((state: any) => state.findRide.rides);
  const finduser = useSelector((state: RootState) => state.search);

  const [checkButton, setCheckButton] = useState(false);

  const handleRequest = async () => {
    try {
      const response = await fetch("http://localhost:8000/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          from: finduser.from,
          to: finduser.to,
          passenger: finduser.passenger,
          Ride_Id: ride._id,
        }),
      });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      if (response.ok) {
        alert("send request to user");
        window.location.href = "/";
      }
    } catch (error: any) {
      console.error("Booking failed:", error.message);
    }
  };

  return (
    <div className={styles.mainComponent}>
      <h1 className={styles.heading}>Check details and book</h1>
      <div className={styles.otcenter}>
        <div className={styles.outercontainer}>
          <div className={styles.firstcontainer}>
            <div className={styles.date}>
              {<FormattedDate date={new Date(ride.planride_date)} />}
            </div>
            <div className={styles.col}>
              <div className={styles.timecol}>
                <div className={styles.inneruptime}>{ride.start_time}</div>
                <div className={styles.innerdowntime}>{ride.end_time}</div>
              </div>
              <div className={styles.divider}>
                <div className={styles.box} />
                <div className={styles.line} />
                <div className={styles.box2} />
              </div>
              <div className={styles.loccol}>
                <div className={styles.innerupplace}>
                  {ride.pick_up.fullAddress}
                  <div className={styles.city}>{ride.pick_up.city}</div>
                </div>
                <div className={styles.innerdownplace}>
                  {ride.drop_off.fullAddress}
                  <div className={styles.city}>{ride.drop_off.city}</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.secondComponent}>
            <div className={styles.linebetween} />
            <div className={styles.priceHeading}>Price Summary</div>
            <div className={styles.passanger}>
              <div>
                <div className={styles.Summaryprice}>
                  I seat: &#8377;{ride.price}
                </div>
                <div className={styles.priceText}>pay in the car </div>
              </div>
              <div className={styles.priceMethod}>CASH</div>
            </div>
          </div>

          <div className={styles.lastComponent}>
            <div className={styles.linebetween} />
            <button
              style={{
                padding: "5px",
                width: "150px",
                height: "40px",
                borderRadius: "10px",
                color: "white",
                backgroundColor: "darkslategrey",
                border: "none",
                marginLeft: "35%",
                marginTop: "5px",
              }}
              onClick={handleRequest}
              disabled={checkButton}
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
