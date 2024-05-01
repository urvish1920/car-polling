"use client";
import { useEffect, useState } from "react";
import styles from "./allUser.module.css";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import Image from "next/image";
import profile from "@/app/assert/avater.png";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useRouter } from "next/navigation";
import { BASE_URL } from "@/app/utils/apiutils";

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
  const [deleteId, setDeleteId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

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
    fetchTotalData();
  }, [currentPage]);

  const handleDelete = (_id: string) => {
    setDeleteId(_id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/deleteUser/${deleteId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
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
                        <DeleteOutlineIcon
                          className={styles.deleteIcon}
                          style={{ color: "red" }}
                          onClick={() => handleDelete(item._id)}
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
              disabled={allUser.length < 5}
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
