"use client";
import React, { useEffect, useState } from "react";
import styles from "./listViewAllRides.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import profileImage from "../assert/avater.png";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import { BASE_URL } from "../utils/apiutils";

interface allRides {
  _id: string;
  Ride_id: string;
  from: {
    city: string;
    fullAddress: string;
    lat: number;
    lng: number;
  };
  to: {
    city: string;
    fullAddress: string;
    lat: number;
    lng: number;
  };
  status_Request: string;
  ride: {
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
    start_time: string;
    end_time: string;
    price: number;
  };
  user: {
    user_name: string;
    image: string;
  };
}

export default function findRide() {
  const [sortBy, setSortBy] = useState("");
  const [allRide, setAllRide] = useState<allRides[]>([]);
  const [isPending, setIsPending] = useState(true);
  const router = useRouter();

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
  };

  const sortRides = (rides: allRides[], sortBy: string) => {
    let sortedArray = [...rides];
    if (sortBy === "option1") {
      sortedArray.sort((a, b) => a.ride.price - b.ride.price);
    } else if (sortBy === "option2") {
      sortedArray.sort((a, b) =>
        a.user.user_name.localeCompare(b.user.user_name)
      );
    }
    return sortedArray;
  };

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch(`${BASE_URL}/request`, {
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
          alert(data.message);
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          if (data.message) {
            setAllRide([]);
          } else {
            setAllRide(sortRides(data, sortBy));
          }
          setIsPending(false);
        }
      } catch (error) {
        alert(error);
        console.error("Error fetching data:", error);
        setIsPending(false);
      }
    };
    fetchRides();
  }, [sortBy]);

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
        </select>
      </div>
      {isPending ? (
        <div className={styles.loading}>
          <CircularProgress color="inherit" />
        </div>
      ) : !allRide || allRide.length === 0 ? (
        <div className={styles.not_Found}>Rides is Not Found</div>
      ) : (
        Array.isArray(allRide) &&
        allRide.map((item, index) => {
          return (
            <div className={styles.otcenter} key={index}>
              <div
                className={styles.outerContainer}
                onClick={() => {
                  router.push(`/myRides/${item._id}`);
                }}
              >
                <div className={styles.col80}>
                  <div className={styles.status_user}>
                    {item.status_Request === "Approve" && (
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <CheckCircleOutlinedIcon
                          style={{ color: "green", marginRight: "10px" }}
                        />
                        <span style={{ color: "green", marginTop: "5px" }}>
                          Approve
                        </span>
                      </div>
                    )}
                    {item.status_Request === "Awaiting Approval" && (
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <NotificationsActiveOutlinedIcon
                          style={{ color: "orange", marginRight: "10px" }}
                        />
                        <span style={{ color: "orange", marginTop: "5px" }}>
                          Awaiting Approval
                        </span>
                      </div>
                    )}
                    {item.status_Request === "Exchange Ratings" && (
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <CurrencyExchangeOutlinedIcon
                          style={{ color: "gray", marginRight: "10px" }}
                        />
                        <span style={{ color: "gray", marginTop: "5px" }}>
                          Exchange Ratings
                        </span>
                      </div>
                    )}
                    {item.status_Request === "cancel" && (
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        <DoDisturbAltOutlinedIcon
                          style={{ color: "red", marginRight: "10px" }}
                        />
                        <span style={{ color: "red", marginTop: "5px" }}>
                          Cancel
                        </span>
                      </div>
                    )}
                  </div>
                  <div className={styles.row}>
                    <div className={styles.timecol}>
                      <div className={styles.inneruptime}>
                        {item.ride.start_time}
                      </div>
                      <div className={styles.innerdowntime}>
                        {item.ride.end_time}
                      </div>
                    </div>
                    <div className={styles.divider}>
                      <div className={styles.box} />
                      <div className={styles.line} />
                      <div className={styles.box2} />
                    </div>
                    <div className={styles.loccol}>
                      <div className={styles.innerupplace}>
                        {item.from.city}
                        <div className={styles.distance}>
                          {item.from.fullAddress}
                        </div>
                      </div>

                      <div className={styles.innerdownplace}>
                        {item.to.city}
                        <div className={styles.distance_arrival}>
                          {item.to.fullAddress}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.row}>
                    <div className={styles.img}>
                      <Image
                        src={item.user.image || profileImage}
                        className={styles.avater}
                        width={50}
                        height={47}
                        alt="Picture of the Rider"
                      />
                    </div>
                    <div className={styles.name}>{item.user.user_name}</div>
                  </div>
                </div>
                <div className={styles.col20}>
                  <div className={styles.otprice}>{item.ride.price}&#8377;</div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
