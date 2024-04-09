"use client";
import React, { useEffect, useState } from "react";
import Styles from "./addVehicle.module.css";
import { useRouter } from "next/navigation";
import Image from "next/image";
import profileImage from "../assert/avater.png";
import { styled } from "@mui/material";

export interface vehicle {
  _id: string;
  user_id: string;
  name: string;
  No_Plate: string;
  model: string;
  seaters: number;
}

export default function findRide() {
  const [vehicles, setVehicles] = useState<vehicle[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [showUpdatePopup, setShowUpdatePopup] = useState(false);
  const [updatedVehicle, setUpdatedVehicle] = useState<vehicle>({
    _id: "",
    user_id: "",
    name: "",
    No_Plate: "",
    model: "",
    seaters: 0,
  });
  console.log(vehicles);
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`http://localhost:8000/vehicle`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          const data = await response.json();
          setVehicles(data);
          setIsPending(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsPending(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleUpdateClick = (vehicle: vehicle) => {
    setShowUpdatePopup(true);
    setUpdatedVehicle(vehicle);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof vehicle
  ) => {
    setUpdatedVehicle({ ...updatedVehicle, [field]: e.target.value });
  };

  const handleUpdateSubmit = async () => {
    console.log(updatedVehicle);

    setShowUpdatePopup(false);
    try {
      const response = await fetch(
        `http://localhost:8000/vehicle/${updatedVehicle._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            updatedVehicle,
          }),
        }
      );
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      } else {
        const data = await response.json();
        setVehicles(data);
        setIsPending(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setIsPending(false);
    }
  };

  return (
    <div className={Styles.vehicleAdd}>
      {showUpdatePopup && <div className={Styles.overlay}></div>}{" "}
      {isPending ? (
        "loading ....."
      ) : vehicles.length === 0 ? (
        <div className={Styles.not_Found}>No vehicle</div>
      ) : (
        vehicles.map((item, index) => {
          return (
            <div className={Styles.otcenter} key={index}>
              <div className={Styles.outerContainer}>
                <div>
                  <div className={Styles.no_plate}>{item.No_Plate}</div>
                  <div className={Styles.modelname_text}>
                    {item.model} {item.name}
                  </div>
                </div>
                <div>
                  <button
                    className={Styles.update_button}
                    onClick={() => handleUpdateClick(item)}
                  >
                    Update car
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
      {/* Update Popup */}
      {showUpdatePopup && (
        <div className={Styles.popup}>
          <h2>Update Vehicle</h2>

          <label className={Styles.label_text}>No plate of car</label>
          <input
            type="text"
            value={updatedVehicle.No_Plate}
            onChange={(e) => handleInputChange(e, "No_Plate")}
          />
          <label className={Styles.label_text}>Model of car</label>
          <input
            type="text"
            value={updatedVehicle.model}
            onChange={(e) => handleInputChange(e, "model")}
          />
          <label className={Styles.label_text}>name of car</label>
          <input
            type="text"
            value={updatedVehicle.name}
            onChange={(e) => handleInputChange(e, "name")}
          />
          <label className={Styles.label_text}>No of seats in car</label>
          <input
            type="text"
            value={updatedVehicle.seaters}
            onChange={(e) => handleInputChange(e, "seaters")}
          />

          <div>
            <button onClick={handleUpdateSubmit}>Update</button>
            <button onClick={() => setShowUpdatePopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}
