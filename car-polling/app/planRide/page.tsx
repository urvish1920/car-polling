"use client";
import React, { useEffect, useState } from "react";
import styles from "./planRideListView.module.css";
import { useRouter } from "next/navigation";
import FormattedDate from "@/app/component/Formate";
import Image from "next/image";
import moneyImage from "../assert/sort_price.svg";
import timeImage from "../assert/sort_time.svg";
import car_bg from "../assert/bg_car_publiser.svg";
import CircularProgress from "@mui/material/CircularProgress";
import { BASE_URL } from "../utils/apiutils";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

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
    image: string;
  };
}

export default function PlanRide() {
  const [sortBy, setSortBy] = useState("");
  const [allRide, setAllRide] = useState<planRide[]>([]);
  const [isPending, setIsPending] = useState(true);
  const router = useRouter();

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value as string);
  };

  const sortRides = (rides: planRide[], sortBy: string) => {
    let sortedArray = [...rides];
    if (sortBy === "option1") {
      sortedArray.sort((a, b) => a.price - b.price);
    } else if (sortBy === "option2") {
      sortedArray.sort((a, b) => {
        const [aHourStr, aMinStr, aAmPm] = a.end_time.split(/[ :]/);
        const [bHourStr, bMinStr, bAmPm] = b.end_time.split(/[ :]/);

        let aHour = parseInt(aHourStr, 10);
        let bHour = parseInt(bHourStr, 10);
        const aMin = parseInt(aMinStr, 10);
        const bMin = parseInt(bMinStr, 10);

        if (aAmPm === "PM" && aHour !== 12) {
          aHour += 12;
        } else if (aAmPm === "AM" && aHour === 12) {
          aHour = 0;
        }

        if (bAmPm === "PM" && bHour !== 12) {
          bHour += 12;
        } else if (bAmPm === "AM" && bHour === 12) {
          bHour = 0;
        }

        const aTotalMinutes = aHour * 60 + aMin;
        const bTotalMinutes = bHour * 60 + bMin;

        return aTotalMinutes - bTotalMinutes;
      });
    }
    return sortedArray;
  };

  const stepStyle = {
    "& .MuiSelect-select": {
      height: "auto",
      minHeight: "1.4375em",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      overflow: "hidden",
      display: "flex",
      alignItems: "center",
    },
  };

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch(`${BASE_URL}/rides/planRide`, {
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
          alert(data.message);
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          setAllRide(sortRides(data, sortBy));
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
              sx={stepStyle}
              label="Sort"
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value="option1">
                {" "}
                <Image
                  src={moneyImage}
                  className={styles.sort}
                  alt="money_icon"
                />
                Price
              </MenuItem>
              <MenuItem value="option2">
                <Image
                  src={timeImage}
                  className={styles.sort}
                  alt="money_icon"
                />
                Earliest departure
              </MenuItem>
            </Select>
          </FormControl>
        </div>
      )}
      {isPending ? (
        <div className={styles.loading}>
          <CircularProgress color="inherit" />
        </div>
      ) : allRide.length === 0 ? (
        <div className={styles.notFound_main}>
          <div className={styles.not_Found}>
            <div className={styles.notFound_text}>
              There are no plan rides yet, Become a car-polling driver and save
              on travel <br />
              costs by sharing your ride with passengers.
            </div>
            <div className={styles.inner_notfound}>
              <button
                className={styles.notFound_button}
                onClick={() => {
                  router.push(`/publishNewCar`);
                }}
              >
                Publish Rides
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
          <div className={styles.bt_text}>Drive.Share.Save</div>
        </div>
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
