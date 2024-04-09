"use client";
import React, { useEffect, useState } from "react";
import Styles from "./planRideListView.module.css";
import { useRouter } from "next/navigation";
import FormattedDate from "@/app/component/Formate";

export interface planRide {
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
        <div>Loading...</div>
      ) : allRide.length === 0 ? (
        <div className={Styles.not_Found}>No plan ride</div>
      ) : (
        allRide.map((item, index) => {
          return (
            <div className={Styles.otcenter} key={index}>
              <div
                className={Styles.outerContainer}
                onClick={() => {
                  router.push(`/planRide/${item._id}`);
                }}
              >
                <div className={Styles.col80}>
                  <div className={Styles.row}>
                    <div className={Styles.date}>
                      {<FormattedDate date={new Date(item.planride_date)} />}
                    </div>
                  </div>
                  <div className={Styles.row}>
                    <div className={Styles.timecol}>
                      <div className={Styles.inneruptime}>
                        {item.start_time}
                      </div>
                      <div className={Styles.innertotalhours}>5h</div>
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
                        <div className={Styles.fullAddress}>fullAddress</div>
                      </div>
                      <div className={Styles.innerdownplace}>
                        {item.drop_off}
                      </div>
                      <div className={Styles.fullAddress}>full Address</div>
                    </div>
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
