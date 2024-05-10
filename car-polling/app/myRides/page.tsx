"use client";
import React, { useEffect, useState } from "react";
import styles from "./listViewAllRides.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import car_bg from "../assert/bg_car_publiser.svg";
import profileImage from "../assert/avater.png";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CurrencyExchangeOutlinedIcon from "@mui/icons-material/CurrencyExchangeOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import DoDisturbAltOutlinedIcon from "@mui/icons-material/DoDisturbAltOutlined";
import { BASE_URL } from "../utils/apiutils";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

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

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value as string);
  };

  const sortRides = (rides: allRides[], sortBy: string) => {
    let sortedArray = [...rides];
    if (sortBy === "option1") {
      sortedArray.sort((a, b) => a.ride.price - b.ride.price);
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
      {!isPending && allRide.length > 0 && (
        <div className={styles.sortCom}>
          <div className={styles.sortText}>Sort By:</div>
          <FormControl
            sx={{
              m: 1,
              minWidth: 200,
              fontSize: "1.8rem",
            }}
          >
            <InputLabel id="demo-simple-select-helper-label">sort</InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              value={sortBy}
              onChange={handleSortChange}
              className={styles.customselect}
              label="Sort"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="option1">Price</MenuItem>
            </Select>
          </FormControl>
        </div>
      )}
      {isPending ? (
        <div className={styles.loading}>
          <CircularProgress color="inherit" />
        </div>
      ) : !allRide || allRide.length === 0 ? (
        <div className={styles.notFound_main}>
          <div className={styles.not_Found}>
            <div className={styles.notFound_text}>
              you not pull any car yet now, Become a car-puller and save a
              travel <br />
              costs.
            </div>
            <div className={styles.inner_notfound}>
              <button
                className={styles.notFound_button}
                onClick={() => {
                  router.push(`/`);
                }}
              >
                find Rides
              </button>
            </div>
            <div className={styles.inner_notfound}>
              <Image
                src={car_bg}
                className={styles.publish_carbg}
                width={600}
                height={600}
                alt={`Picture of car`}
              />
            </div>
          </div>
        </div>
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
                    <div className={styles.name}>
                      {item.user.user_name.charAt(0).toUpperCase() +
                        item.user.user_name.slice(1)}
                    </div>
                  </div>
                </div>
                <div className={styles.col20}>
                  <div className={styles.otprice}>&#8377;{item.ride.price}.</div>
                  <div className={styles.pricedec}>00</div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
