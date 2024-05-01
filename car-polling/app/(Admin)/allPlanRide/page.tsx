"use client";
import { useEffect, useState } from "react";
import styles from "./allPlanRide.module.css";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import Image from "next/image";
import profile from "@/app/assert/avater.png";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import FormattedDate from "@/app/component/Formate";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/app/utils/apiutils";

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
  const [deleteId, setDeleteId] = useState("");
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

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
    fetchTotalData();
  }, [currentPage]);

  const handleDelete = (_id: string) => {
    setDeleteId(_id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/deleteRide/${deleteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        alert(`Failed to delete user ${response}`);
        throw new Error(`Failed to delete user with ID ${deleteId}`);
      }
      alert(data.message);
      window.location.reload();
    } catch (error) {
      alert(error);
      console.error("Error deleting user:", error);
    }
    setShowModal(false);
  };

  const cancelDelete = () => {
    setShowModal(false);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
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
                      <div className={styles.user_name}>
                        {item.pick_up.city}{" "}
                        <TrendingFlatIcon className={styles.arrow} />{" "}
                        {item.drop_off.city}
                      </div>
                      <div className={styles.next_con}>
                        <div className={styles.user_img}>
                          <Image
                            src={item.user.image || profile}
                            className={styles.user_avater}
                            width={50}
                            height={47}
                            alt="User Profile"
                          />
                          <DeleteOutlineIcon
                            className={styles.deleteIcon}
                            style={{ color: "red" }}
                            onClick={() => handleDelete(item._id)}
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
              disabled={allRides.length < 5}
              className={styles.prevNextButtons}
            >
              Next
            </button>
          </div>
        </div>
      )}
      {showModal && (
        <div className={styles.modalBackground}>
          <div className={styles.modalContainer}>
            <div className={styles.text}>
              Are you sure you want to delete this user?
            </div>
            <div>
              <button onClick={confirmDelete}>Yes</button>
              <button onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
