"use client";
import React, { useEffect, useState } from "react";
import styles from "./findRideListView.module.css";
import { notFound, useRouter } from "next/navigation";
import Image from "next/image";
import profileImage from "../assert/avater.png";
import moneyImage from "../assert/sort_price.svg";
import timeImage from "../assert/sort_time.svg";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import CircularProgress from "@mui/material/CircularProgress";
import DistanceCalculator from "../component/DistanceCalulator";
import { BASE_URL } from "../utils/apiutils";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormattedDate from "../component/Formate";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";

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
    image: string;
  };
}

export default function findRide() {
  const [sortBy, setSortBy] = useState<string>("");
  const [allRide, setAllRide] = useState<findState[]>([]);
  const [isPending, setIsPending] = useState(true);

  const router = useRouter();

  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value as string);
  };

  const sortRides = (rides: findState[], sortBy: string) => {
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

  const data = useSelector((state: RootState) => state.search);
  const from = data.from;
  const to = data.to;
  const date = data.date;
  const passenger = data.passenger;

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/rides/filterData?from=${JSON.stringify(
            from
          )}&to=${JSON.stringify(to)}&date=${date}&passanger=${passenger}`,
          {
            credentials: "include",
          }
        );
        const data = await response.json();
        if (!response.ok) {
          alert(data.message);
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          if (data.message) {
            setAllRide([]);
          } else {
            setAllRide(sortRides(data.rides, sortBy));
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

  const calculateTotalTime = (
    startTime: string,
    endTime: string
  ): { hours: number; minutes: string } => {
    const [startHourStr, startMinStr, startAmPm] = startTime.split(/[ :]/);
    const [endHourStr, endMinStr, endAmPm] = endTime.split(/[ :]/);

    let startHour = parseInt(startHourStr, 10);
    let endHour = parseInt(endHourStr, 10);
    const startMin = parseInt(startMinStr, 10);
    const endMin = parseInt(endMinStr, 10);

    if (startAmPm === "PM" && startHour !== 12) {
      startHour += 12;
    } else if (startAmPm === "AM" && startHour === 12) {
      startHour = 0;
    }

    if (endAmPm === "PM" && endHour !== 12) {
      endHour += 12;
    } else if (endAmPm === "AM" && endHour === 12) {
      endHour = 0;
    }

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    let differenceMinutes = Math.abs(endMinutes - startMinutes);

    if (endMinutes < startMinutes) {
      differenceMinutes = 24 * 60 - differenceMinutes;
    }

    const totalHours = Math.floor(differenceMinutes / 60);
    const totalMinutes = String(differenceMinutes % 60).padStart(2, "0");

    return { hours: totalHours, minutes: totalMinutes };
  };
  return (
    <div className={styles.planRide}>
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
            label="Sort"
            sx={stepStyle}
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
              <Image src={timeImage} className={styles.sort} alt="money_icon" />
              Earliest departure
            </MenuItem>
          </Select>
        </FormControl>
      </div>
      {isPending ? (
        <div className={styles.loading}>
          <CircularProgress color="inherit" />
        </div>
      ) : allRide.length === 0 ? (
        <div className={styles.notFound_main}>
          <div className={styles.not_Found}>
            <div className={styles.user_date}>
              {<FormattedDate date={new Date(data.date)} />}
            </div>
            <div className={styles.notFound_text}>
              There are no rides yet for today between these
              <br /> cities
            </div>
            <div className={styles.city_name}>
              {from.fullAddress}
              <TrendingFlatIcon className={styles.arrow} />
              {to.fullAddress}
            </div>
          </div>
        </div>
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
                        <div className={styles.distance}>
                          <DistanceCalculator
                            origin={from.fullAddress}
                            destination={item.pick_up.fullAddress}
                          />{" "}
                          from your departure
                        </div>
                      </div>
                      <div className={styles.innerdownplace}>
                        {item.drop_off.city}
                        <div className={styles.distance_arrival}>
                          {/* <DistanceCalculator
                            origin={to.fullAddress}
                            destination={item.drop_off.fullAddress}
                          />{" "} */}
                          from your arrival
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
                        alt="User Profile"
                      />
                    </div>
                    <div className={styles.name}>{item.user.user_name}</div>
                  </div>
                </div>
                <div className={styles.col20}>
                  <div className={styles.otprice}>&#8377;{item.price}.</div>
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
