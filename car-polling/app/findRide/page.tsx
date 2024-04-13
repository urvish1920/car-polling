"use client";
import React, { useEffect, useState } from "react";
import styles from "./findRideListView.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import profileImage from "../assert/avater.png";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CircularProgress from "@mui/material/CircularProgress";
import DistanceCalculator from "../component/DistanceCalulator";

export interface findState {
  _id: string;
  vehicle_id: string;
  pick_up: {
    city: string;
    fullAddress: string;
    lat: number;
    lng: number;
  };
  drop_off: {
    city: string;
    fullAddress: string;
    lat: number;
    lng: number;
  };
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
  const from = data.from;
  const to = data.to;
  const date = data.date;
  const passenger = data.passenger;

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/rides/filterData?from=${JSON.stringify(
            from
          )}&to=${JSON.stringify(to)}&date=${date}&passanger=${passenger}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          const data = await response.json();
          if (data.message) {
            setAllRide([]);
          } else {
            setAllRide(data.rides);
          }
          setIsPending(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsPending(false);
      }
    };
    fetchRides();
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
    <div className={styles.planRide}>
      <div className={styles.text}>
        Sort By:
        <select
          className={styles.customselect}
          value={sortBy}
          onChange={handleSortChange}
        >
          <option value="">Select sort type</option>
          <option value="option1">price</option>
          <option value="option2">Passenger</option>
        </select>
      </div>
      {isPending ? (
        <div className={styles.loading}>
          <CircularProgress color="inherit" />
        </div>
      ) : allRide.length === 0 ? (
        <div className={styles.not_Found}>Rides is Not Found</div>
      ) : (
        Array.isArray(allRide) &&
        allRide.map((item, index) => {
          const totalTime = calculateTotalTime(item.start_time, item.end_time);
          return (
            <div className={styles.otcenter} key={index}>
              <div
                className={styles.outerContainer}
                onClick={() => {
                  router.push(`/findRide/${item._id}`);
                }}
              >
                <div className={styles.col80}>
                  <div className={styles.row}>
                    <div className={styles.timecol}>
                      <div className={styles.inneruptime}>
                        {item.start_time}
                      </div>
                      <div className={styles.innertotalhours}>
                        {totalTime.hours}:{totalTime.minutes}h
                      </div>
                      <div className={styles.innerdowntime}>
                        {item.end_time}
                      </div>
                    </div>
                    <div className={styles.divider}>
                      <div className={styles.box} />
                      <div className={styles.line} />
                      <div className={styles.box2} />
                    </div>
                    <div className={styles.loccol}>
                      <div className={styles.innerupplace}>
                        {item.pick_up.city}
                        <div className={styles.fullAddress}>
                          {item.pick_up.fullAddress}
                          {
                            <DistanceCalculator
                              origin={to.fullAddress}
                              destination={item.drop_off.fullAddress}
                            />
                          }
                        </div>
                      </div>

                      <div className={styles.innerdownplace}>
                        {item.drop_off.city}
                        <div className={styles.fullAddress}>
                          {item.drop_off.fullAddress}
                          {
                            <DistanceCalculator
                              origin={to.fullAddress}
                              destination={item.drop_off.fullAddress}
                            />
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.img}>
                      <Image
                        src={profileImage}
                        className={styles.avater}
                        width={40}
                        height={35}
                        alt="Picture of the author"
                      />
                    </div>
                    <div className={styles.name}>{item.user.user_name}</div>
                  </div>
                </div>
                <div className={styles.col20}>
                  <div className={styles.otprice}>{item.price}&#8377;</div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
