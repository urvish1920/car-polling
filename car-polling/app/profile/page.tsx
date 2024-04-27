"use client";
import styles from "./userprofile.module.css";
import Image from "next/image";
import profileImage from "../assert/avater.png";
import { Button, CircularProgress } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useEffect, useRef, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddCarPopup from "../component/(profileComponent)/AddCarPopup";
import UpdateCarPopup from "../component/(profileComponent)/updateCar";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { updateUserImage } from "../redux/slice/userDataReducer";

export interface User {
  _id: string;
  user_name: string;
  email: string;
  image: string;
  IsAdmin: boolean;
}

interface vehicle {
  _id: string;
  user_id: string;
  name: string;
  No_Plate: string;
  model: string;
  color: string;
  seaters: number;
}

const Profile = () => {
  const [user, setUser] = useState<User>();
  const [vehicle, setVehicles] = useState<vehicle[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isUpdateCarPopupOpen, setIsUpdateCarPopupOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const router = useRouter();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch(`http://localhost:8000/auth/getUser`, {
          credentials: "include",
        });
        if (!userResponse.ok) {
          throw new Error(
            `User data request failed with status ${userResponse.status}`
          );
        }
        const userData = await userResponse.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      try {
        const vehiclesResponse = await fetch(`http://localhost:8000/vehicle`, {
          credentials: "include",
        });
        if (!vehiclesResponse.ok) {
          throw new Error(
            `Vehicles data request failed with status ${vehiclesResponse.status}`
          );
        }
        const vehiclesData = await vehiclesResponse.json();
        setVehicles(vehiclesData);
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const handleAddCar = async (carData: any) => {
    console.log(carData);
    try {
      const response = await fetch("http://localhost:8000/vehicle", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(carData),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        throw new Error(`Server responded with status ${response.status}`);
      }
      alert(data.message);
      setIsPopupOpen(false);
      window.location.reload();
    } catch (error: any) {
      console.error(error.message);
    }
  };

  const handleUpdateCar = async (carData: any) => {
    console.log(carData);
    try {
      const response = await fetch(
        `http://localhost:8000/vehicle/${selectedVehicle?._id}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(carData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      alert(data.message);
      setIsUpdateCarPopupOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  const handleUpdatePopupOpen = (vehicle: vehicle) => {
    setSelectedVehicle(vehicle);
    setIsUpdateCarPopupOpen(true);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8000/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        console.log("Logout successful");
        window.location.href = "/signIn";
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);

    if (file) {
      const formdata = new FormData();
      const filename = Date.now() + file.name;
      formdata.append("name", filename);
      formdata.append("file", file);

      try {
        const response = await fetch(
          `http://localhost:8000/auth/updateUser/${user?._id}`,
          {
            method: "PATCH",
            credentials: "include",
            body: formdata,
          }
        );
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
        const data = await response.json();
        alert("image added successfully uploaded");
        console.log(data);
        dispatch(updateUserImage(data.img));
        window.location.reload();
      } catch (error) {
        console.error("Error updating user image:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <CircularProgress color="inherit" />
      </div>
    );
  } else {
    return (
      <div className={styles.profilePage}>
        <div className={styles.main_container}>
          <div className={styles.profileHeading}>My Profile</div>
          <div className={styles.first_con}>
            <div className={styles.name}>
              {user?.user_name &&
                user.user_name.charAt(0).toUpperCase() +
                  user.user_name.slice(1)}
            </div>

            <div className={styles.img}>
              {user ? (
                <Image
                  src={user.image || profileImage}
                  className={styles.avater}
                  width={80}
                  height={80}
                  alt="Picture of the author"
                />
              ) : (
                <Image
                  src={profileImage}
                  className={styles.avater}
                  width={80}
                  height={75}
                  alt="Default Avatar"
                />
              )}
            </div>
          </div>
          <div className={styles.second_con}>
            <Button
              variant="text"
              className={styles.editButton}
              onClick={() => fileInputRef.current?.click()}
            >
              <ControlPointIcon className={styles.editIcon} /> Edit Profile
              picture
              <input
                onChange={handleImageChange}
                id="file-upload"
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
              />
            </Button>
            <Button
              variant="text"
              className={styles.editButton}
              onClick={() => {
                router.push(`/profile/updatePassword`);
              }}
            >
              Change Password
            </Button>
          </div>
          {!user?.IsAdmin && (
            <div className={styles.third_con}>
              <div className={styles.linebetween} />
              <div className={styles.car_details}>
                <div className={styles.headingCar}>About Car</div>
                <Button
                  variant="text"
                  className={styles.carEditButton}
                  onClick={() => setIsPopupOpen(true)}
                >
                  <ControlPointIcon className={styles.editIcon} /> Add the car
                </Button>
              </div>
              {vehicle.length === 0 ? (
                <div className={styles.not_Found}>No vehicle</div>
              ) : (
                vehicle.map((item, index) => (
                  <div className={styles.space_between} key={index}>
                    <div>
                      <div className={styles.carname}>
                        {item.model} {item.name}
                      </div>
                      <div className={styles.carColor}>{item.color}</div>
                    </div>
                    <div>
                      <ChevronRightIcon
                        style={{
                          fontSize: "2rem",
                          marginTop: "10px",
                        }}
                        onClick={() => handleUpdatePopupOpen(item)}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
          <div className={styles.forthComponent}>
            <div className={styles.linebetween} />
            <div className={styles.buttons}>
              <button className={styles.logoutBtn} onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
        {isPopupOpen && (
          <AddCarPopup
            onClose={() => setIsPopupOpen(false)}
            onAddCar={handleAddCar}
          />
        )}
        {isUpdateCarPopupOpen && selectedVehicle && (
          <UpdateCarPopup
            onClose={() => setIsUpdateCarPopupOpen(false)}
            onUpdateCar={handleUpdateCar}
            vehicle={selectedVehicle}
          />
        )}
      </div>
    );
  }
};

export default Profile;
