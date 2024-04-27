"use client";
import { useSelector } from "react-redux";
import Styles from "./(home)/home.module.css";
import Search from "./(home)/search";
import { RootState } from "./redux/store";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";

export interface TotalCount {
  totalUsers: number;
  totalRides: number;
  totalRequests: number;
}
export default function Home() {
  const [isPending, setIsPending] = useState(true);
  const [totalCount, setTotalCount] = useState<TotalCount>();
  console.log(totalCount);
  const isAdmin = useSelector((state: RootState) => state.auth.user);

  if (isAdmin?.IsAdmin) {
    useEffect(() => {
      const fetchTotalData = async () => {
        try {
          const response = await fetch(`http://localhost:8000/admin/totals`, {
            credentials: "include",
          });
          if (!response.ok) {
            throw new Error(`Server responded with status ${response.status}`);
          } else {
            const data = await response.json();
            setTotalCount(data);
            setIsPending(false);
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setIsPending(false);
        }
      };
      fetchTotalData();
    }, []);
    return (
      <div className={Styles.home}>
        {isPending ? (
          <div className={Styles.loading}>
            <CircularProgress />
          </div>
        ) : (
          <div className={Styles.inner_container}>
            <div className={Styles.headingAdmin}>
              Hii {isAdmin.user_name} You Can Check All Data
            </div>
            <div className={Styles.AdminHome}>
              <div className={Styles.AdminCheckUser}>
                <div className={Styles.inner_text}>Total No of User</div>
                <div className={Styles.totalNo}>{totalCount?.totalUsers}</div>
              </div>
              <div className={Styles.AdminCheckTotalPublish}>
                <div className={Styles.inner_text_publish}>
                  Total No of Ride Publish
                </div>
                <div className={Styles.totalNo}>{totalCount?.totalRides}</div>
              </div>
            </div>
            <div className={Styles.another_com}>
              <div className={Styles.AdminCheckTotelRequest}>
                <div className={Styles.inner_text_publish}>
                  No of Request of findRide
                </div>
                <div className={Styles.totalNo}>
                  {totalCount?.totalRequests}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className={Styles.home}>
        <div className={Styles.inner_container}>
          <span className={Styles.homeheading}>
            Choose Your Perfect Ride Partner
          </span>
          <h1 className={Styles.homeheading_second}>
            Looking For
            <br />A Ride
          </h1>
          <Search />
        </div>
      </div>
    );
  }
}
