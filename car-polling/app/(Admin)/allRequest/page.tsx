"use client";
import { useEffect, useState } from "react";
import styles from "./allRequest.module.css";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import Image from "next/image";
import profile from "@/app/assert/avater.png";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import FormattedDate from "@/app/component/Formate";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/app/utils/apiutils";

interface Request {
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
    planride_date: Date;
  };
  user: {
    user_name: string;
    image: string;
  };
}

export default function AllUserPage() {
  const [isPending, setIsPending] = useState(true);
  const [allRequest, setAllRequest] = useState<Request[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  console.log(allRequest);
  const router = useRouter();

  useEffect(() => {
    const fetchTotalData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/admin/AllRequest?page=${currentPage}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          const data = await response.json();
          setAllRequest(data.AllRequest);
          setIsPending(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsPending(false);
      }
    };
    fetchTotalData();
  }, [currentPage]);

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className={styles.allUser}>
      <div className={styles.heading_allUser}>All Request</div>
      {isPending ? (
        <div className={styles.loading}>
          <CircularProgress color="inherit" />
        </div>
      ) : allRequest.length === 0 ? (
        <div className={styles.not_Found}>No data</div>
      ) : (
        <div className={styles.otcenter}>
          <div className={styles.inner_container}>
            {Array.isArray(allRequest) &&
              allRequest.map((item, index) => {
                return (
                  <div className={styles.outerContainer} key={index}>
                    <div className={styles.firstcontainer}>
                      <div className={styles.user_name}>
                        {item.from.city}{" "}
                        <TrendingFlatIcon className={styles.arrow} />{" "}
                        {item.to.city}
                      </div>
                      <div className={styles.next_con}>
                        <div className={styles.user}>
                          <div className={styles.user_name}>
                            {item.user.user_name.charAt(0).toUpperCase() +
                              item.user.user_name.slice(1)}
                          </div>
                          <Image
                            src={item.user.image || profile}
                            className={styles.user_avater}
                            width={50}
                            height={47}
                            alt="User Profile"
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles.secondComponent}>
                      <div className={styles.date}>
                        <FormattedDate
                          date={new Date(item.ride.planride_date)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={styles.prevNextButtons}
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              disabled={allRequest.length < 5}
              className={styles.prevNextButtons}
            >
              Next
            </button>
          </div>
        </div>
      )}
      hyy
    </div>
  );
}
