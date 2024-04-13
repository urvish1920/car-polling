"use client";
import React, { useEffect, useState } from "react";
import styles from "./planRideListView.module.css";
import { useRouter } from "next/navigation";
import FormattedDate from "@/app/component/Formate";
import Image from "next/image";
import car from "../assert/logo.png";
import CircularProgress from "@mui/material/CircularProgress";

export interface planRide {
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
  ride_status: string;
  user: {
    user_name: string;
  };
}

export default function PlanRide() {
  const [sortBy, setSortBy] = useState("");
  const [allRide, setAllRide] = useState<planRide[]>([]);
  const [isPending, setIsPending] = useState(true);
  const router = useRouter();

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch(`http://localhost:8000/rides/planRide`, {
          credentials: "include",
        });
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
        <div className={styles.not_Found}>No plan ride</div>
      ) : (
        allRide.map((item, index) => {
          console.log(item);
          return (
            <div className={styles.otcenter} key={index}>
              <div
                className={styles.outerContainer}
                onClick={() => {
                  router.push(`/planRide/${item._id}`);
                }}
              >
                <div className={styles.col80}>
                  <div className={styles.row}>
                    <div className={styles.date}>
                      {<FormattedDate date={new Date(item.planride_date)} />}
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.timecol}>
                      <div className={styles.inneruptime}>
                        {item.start_time}
                      </div>
                      <div className={styles.innertotalhours}>5h</div>
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
                      <div>
                        <div className={styles.innerupplace}>
                          {item.pick_up.city}
                        </div>
                        <div className={styles.fullAddress}>
                          {item.pick_up.fullAddress}
                        </div>
                      </div>
                      <div className={styles.innerdownplace}>
                        {item.drop_off.city}
                      </div>
                      <div className={styles.fullAddress}>
                        {item.drop_off.fullAddress}
                      </div>
                    </div>
                  </div>
                  <div className={styles.statuscon}>
                    <div className={styles.statusText}>
                      {" "}
                      Ride was {item.ride_status}!{" "}
                    </div>
                    <div>
                      {item.ride_status === "started" && (
                        <Image
                          src={car}
                          className={styles.avater}
                          width={50}
                          height={34}
                          alt={`Picture of car`}
                        />
                      )}
                    </div>
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
