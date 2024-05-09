"use client";
import { useEffect, useState } from "react";
import styles from "./allUser.module.css";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import Image from "next/image";
import profile from "@/app/assert/avater.png";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/app/utils/apiutils";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import Stack from "@mui/material/Stack/Stack";
import Pagination from "@mui/material/Pagination/Pagination";

export interface User {
  _id: string;
  user_name: string;
  image: string;
  email: string;
  requestsCount: number;
  ridesCount: number;
}

export default function AllUserPage() {
  const [isPending, setIsPending] = useState(true);
  const [allUser, setAllUser] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const totalCount = useSelector(
    (state: RootState) => state.totalDateAdmin.totalData?.totalUsers
  );

  useEffect(() => {
    const fetchTotalData = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/admin/AllUser?page=${currentPage}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          const data = await response.json();
          console.log(data);
          setAllUser(data.AllUsers);
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
  }, [currentPage, totalCount]);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setCurrentPage(value);
  };

  return (
    <div className={styles.allUser}>
      <div className={styles.heading_allUser}>All User</div>
      {isPending ? (
        <div className={styles.loading}>
          <CircularProgress color="inherit" />
        </div>
      ) : allUser.length === 0 ? (
        <div className={styles.not_Found}>No data</div>
      ) : (
        <div className={styles.otcenter}>
          <div className={styles.inner_container}>
            {allUser.map((item, index) => {
              return (
                <div className={styles.outerContainer} key={index}>
                  <div className={styles.firstcontainer}>
                    <div className={styles.user_name}>
                      {item.user_name.charAt(0).toUpperCase() +
                        item.user_name.slice(1)}
                    </div>
                    <div className={styles.next_con}>
                      <div className={styles.user_img}>
                        <Image
                          src={item.image || profile}
                          className={styles.user_avater}
                          width={50}
                          height={47}
                          alt="User Profile"
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.secondComponent}>
                    <div className={styles.totalPublishRide}>
                      Publish Ride : {item.ridesCount}
                    </div>
                    <div className={styles.totalRequestRide}>
                      Request Ride : {item.requestsCount}
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
