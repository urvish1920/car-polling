"use client";
import styles from "./userprofile.module.css";
import Image from "next/image";
import profileImage from "../assert/avater.png";
import { Button } from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import { useEffect, useState } from "react";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddCarPopup from "../component/(profileComponent)/AddCarPopup";
import UpdateCarPopup from "../component/(profileComponent)/updateCar";

interface User {
  _id: string;
  user_name: string;
  email: string;
  image: string;
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

  console.log(vehicle);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`http://localhost:8000/auth/getUser`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          const data = await response.json();
          if (data.message) {
            alert(data.message);
          } else {
            setUser(data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getUser();

    const getVehiles = async () => {
      try {
        const response = await fetch(`http://localhost:8000/vehicle`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          const data = await response.json();
          setVehicles(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getVehiles();
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
      if (!response.ok) {
        alert("there is some problem");
        throw new Error(`Server responded with status ${response.status}`);
      }
      if (response.ok) {
        alert("car was added");
        setIsPopupOpen(false);
      }
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
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      alert("Car was updated successfully");
      setIsUpdateCarPopupOpen(false);
    } catch (error) {
      console.error("Error updating car:", error);
    }
  };

  const handleUpdatePopupOpen = (vehicle: vehicle) => {
    setSelectedVehicle(vehicle);
    setIsUpdateCarPopupOpen(true);
  };

  return (
    <>
      <div className={styles.main_container}>
        <div className={styles.profileHeading}>My Profile</div>
        <div className={styles.first_con}>
          <div className={styles.name}>
            {user?.user_name &&
              user.user_name.charAt(0).toUpperCase() + user.user_name.slice(1)}
          </div>

          <div className={styles.img}>
            <Image
              src={profileImage}
              className={styles.avater}
              width={80}
              height={75}
              alt="Picture of the author"
            />
          </div>
        </div>
        <div className={styles.second_con}>
          <Button variant="text" className={styles.editButton}>
            <ControlPointIcon className={styles.editIcon} /> Edit Profile
            picture
          </Button>
          <Button variant="text" className={styles.editButton}>
            Change Password
          </Button>
        </div>
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
    </>
  );
};

export default Profile;
