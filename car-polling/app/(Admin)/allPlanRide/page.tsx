"use client";
import React, { useEffect, useState } from "react";
import styles from "./allPlanRide.module.css";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import Image from "next/image";
import profile from "@/app/assert/avater.png";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import FormattedDate from "@/app/component/Formate";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/app/utils/apiutils";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Pagination, { paginationClasses } from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface Rides {
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
  planride_date: string;
  start_time: string;
  end_time: string;
  price: number;
  ride_status: string;
  user: {
    user_name: string;
    image: string;
  };
}

export default function AllUserPage() {
  const [isPending, setIsPending] = useState(true);
  const [allRides, setAllRides] = useState<Rides[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const router = useRouter();

  const totalCount = useSelector(
    (state: RootState) => state.totalDateAdmin.totalData?.totalRides
  );

  useEffect(() => {
    const fetchTotalData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/admin/AllRides?page=${currentPage}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          const data = await response.json();
          setAllRides(data.AllRides);
          setIsPending(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsPending(false);
      }
    };
    if (totalCount !== undefined) {
      const totalPages = Math.ceil(totalCount / 5);
      if (currentPage <= totalPages) {
        fetchTotalData();
      }
    }
  }, [currentPage]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  return (
    <div className={styles.allUser}>
      <div className={styles.heading_allUser}>All Rides</div>
      {isPending ? (
        <div className={styles.loading}>
          <CircularProgress color="inherit" />
        </div>
      ) : allRides.length === 0 ? (
        <div className={styles.not_Found}>No data</div>
      ) : (
        <div className={styles.otcenter}>
          <div className={styles.inner_container}>
            {Array.isArray(allRides) &&
              allRides.map((item, index) => {
                return (
                  <div
                    className={styles.outerContainer}
                    key={index}
                    onClick={() => {
                      router.push(`/allPlanRide/${item._id}`);
                    }}
                  >
                    <div className={styles.firstcontainer}>
                      <div className={styles.ride_name}>
                        {item.pick_up.city}{" "}
                        <TrendingFlatIcon className={styles.arrow} />{" "}
                        {item.drop_off.city}
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
                        <FormattedDate date={new Date(item.planride_date)} />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          {totalCount && (
            <div className={styles.paginationButton}>
              <Stack spacing={2} className={styles.pagination}>
                <Pagination
                  count={Math.ceil(totalCount / 5)}
                  page={currentPage}
                  onChange={handlePageChange}
                  variant="outlined"
                  shape="rounded"
                  color="primary"
                />
              </Stack>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
