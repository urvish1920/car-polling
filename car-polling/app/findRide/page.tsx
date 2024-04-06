"use client";
import React, { useEffect, useState } from "react";
import Styles from "./findRideListView.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import profileImage from "../assert/avater.png";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { styled } from "@mui/material";

export interface findState {
  _id: string;
  vehicle_id: string;
  pick_up: string;
  drop_off: string;
  planride_date: Date;
  start_time: string;
  end_time: string;
  price: number;
  user: {
    user_name: string;
  };
}

export default function findRide() {
  const [sortBy, setSortBy] = useState("");
  const [allRide, setAllRide] = useState<findState[]>([]);
  const [isPending, setIsPending] = useState(true);
  const router = useRouter();

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const data = useSelector((state: RootState) => state.search);
  console.log(data);

  const from = data.from.charAt(0).toUpperCase() + data.from.slice(1);
  const to = data.to.charAt(0).toUpperCase() + data.to.slice(1);
  const date = data.date;
  const passenger = data.passenger;

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/rides/filterData?from=${from}&to=${to}&date=${date}&passanger=${passenger}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          const data = await response.json();
          console.log(data);
          setAllRide(data);
          setIsPending(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsPending(false);
      }
    };

    const fetchTimeout = setTimeout(() => {
      setIsPending(false);
      console.log("Server is not responding. Please try again later.");
    }, 5000);

    fetchRides();

    return () => clearTimeout(fetchTimeout);
  }, []);

  const calculateTotalTime = (
    startTime: string,
    endTime: string
  ): { hours: number; minutes: string } => {
    const startParts = startTime.split(":").map(Number);
    const endParts = endTime.split(":").map(Number);

    const startMinutes = startParts[0] * 60 + startParts[1];
    const endMinutes = endParts[0] * 60 + endParts[1];

    const differenceMinutes = Math.abs(endMinutes - startMinutes);

    const totalHours = Math.floor(differenceMinutes / 60);
    const totalMinutes = String(differenceMinutes % 60).padStart(2, "0");

    return { hours: totalHours, minutes: totalMinutes };
  };

  return (
    <div className={Styles.planRide}>
      <div className={Styles.text}>
        Sort By:
        <select
          className={Styles.customselect}
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="">Select sort type</option>
          <option value="option1">price</option>
          <option value="option2">Passenger</option>
        </select>
      </div>
      {isPending ? (
        "loading ....."
      ) : allRide.length === 0 ? (
        <div className={Styles.not_Found}>No Rides on this data</div>
      ) : (
        allRide.map((item, index) => {
          const totalTime = calculateTotalTime(item.start_time, item.end_time);
          return (
            <div className={Styles.otcenter} key={index}>
              <div
                className={Styles.outerContainer}
                onClick={() => {
                  router.push(`/findRide/${item._id}`);
                }}
              >
                <div className={Styles.col80}>
                  <div className={Styles.row}>
                    <div className={Styles.timecol}>
                      <div className={Styles.inneruptime}>
                        {item.start_time}
                      </div>
                      <div className={Styles.innertotalhours}>
                        {totalTime.hours}:{totalTime.minutes}h
                      </div>
                      <div className={Styles.innerdowntime}>
                        {item.end_time}
                      </div>
                    </div>
                    <div className={Styles.divider}>
                      <div className={Styles.box} />
                      <div className={Styles.line} />
                      <div className={Styles.box2} />
                    </div>
                    <div className={Styles.loccol}>
                      <div>
                        <div className={Styles.innerupplace}>
                          {item.pick_up}
                        </div>
                        <div className={Styles.fullAddress}>full Address</div>
                      </div>
                      <div className={Styles.innerdownplace}>
                        {item.drop_off}
                      </div>
                      <div className={Styles.fullAddress}>full Address</div>
                    </div>
                  </div>
                  <div className={Styles.row}>
                    <div className={Styles.img}>
                      <Image
                        src={profileImage}
                        className={Styles.avater}
                        width={40}
                        height={35}
                        alt="Picture of the author"
                      />
                    </div>
                    <div className={Styles.name}>{item.user.user_name}</div>
                  </div>
                </div>
                <div className={Styles.col20}>
                  <div className={Styles.otprice}>{item.price}&#8377;</div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
