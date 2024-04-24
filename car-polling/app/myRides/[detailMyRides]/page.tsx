"use client";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Image from "next/image";
import profileImage from "../../assert/avater.png";
import icon from "../../assert/icon.png";
import car from "../../assert/car.png";
import styles from "./detailsMyRides.module.css";
import FormattedDate from "@/app/component/Formate";
import CircularProgress from "@mui/material/CircularProgress";
import CancelRideModal from "./cancelHandle";

export interface Ride {
  _id: string;
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
    planride_date: Date;
    start_time: string;
    end_time: string;
    price: number;
    occupation: [];
  };
  user: {
    user_name: string;
    image: string;
  };
  vehicle: {
    name: string;
    No_Plate: string;
    model: string;
    seaters: Number;
  };
}

export default function FullDetailRide({
  params,
}: {
  params: { detailMyRides: string };
}) {
  const id = params.detailMyRides;
  const [userRide, setUserRide] = useState<Ride>();
  const [isPending, setIsPending] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleDelete = () => {
    console.log("deleted user");
    fetch(`http://localhost:8000/rides/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        ride_id: userRide?.ride._id,
        request_id: userRide?._id,
      }),
    })
      .then((response) => {
        if (response.ok) {
          alert("request deleted successfully");
        } else {
          alert("there is some problem try after some time");
        }
      })
      .catch((error) => {
        console.error("Error deleting ride request:", error);
      });
    setShowModal(false);
  };

  const handleCancelEvent = () => {
    setShowModal(true);
  };

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const response = await fetch(`http://localhost:8000/request/${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          const data = await response.json();
          if (data.message) {
            alert(data.message);
          } else {
            setUserRide(data[0]);
          }
          setIsPending(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsPending(false);
      }
    };
    fetchRides();
  }, []);

  return (
    <div>
      {isPending ? (
        <div className={styles.loading}>
          <CircularProgress color="inherit" />
        </div>
      ) : userRide ? (
        <div>
          <h1 className={styles.heading}>
            <FormattedDate date={new Date(userRide.ride.planride_date)} />
          </h1>
          <div className={styles.otcenter}>
            <div className={styles.outercontainer}>
              <div className={styles.firstcontainer}>
                <div className={styles.date}>
                  <FormattedDate date={new Date(userRide.ride.planride_date)} />
                </div>
                <div className={styles.col}>
                  <div className={styles.timecol}>
                    <div className={styles.inneruptime}>
                      {userRide.ride.start_time}
                    </div>
                    <div className={styles.innerdowntime}>
                      {userRide.ride.end_time}
                    </div>
                  </div>
                  <div className={styles.divider}>
                    <div className={styles.box} />
                    <div className={styles.line} />
                    <div className={styles.box2} />
                  </div>
                  <div className={styles.loccol}>
                    <div className={styles.innerupplace}>
                      {userRide.from.fullAddress}
                      <div className={styles.distance}>
                        {userRide.from.city}
                      </div>
                    </div>
                    <div className={styles.innerdownplace}>
                      {userRide.to.fullAddress}
                      <div className={styles.distance_arrival}>
                        {userRide.to.city}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.secondComponent}>
                <div className={styles.linebetween} />
                <div className={styles.space_between_text}>
                  <div className={styles.priceText}>
                    Total Price for 1 Passenger
                  </div>
                  <div className={styles.price}>
                    &#8377;{userRide.ride.price}
                  </div>
                </div>
              </div>
              <div className={styles.thirdComponent}>
                <div className={styles.linebetween} />
                <div className={styles.space_between_text}>
                  <div className={styles.username}>
                    {userRide.user.user_name}
                  </div>
                  <div className={styles.owner_img}>
                    <Image
                      src={userRide.user.image || profileImage}
                      className={styles.owner_avater}
                      width={50}
                      height={47}
                      alt="Picture of the author"
                    />
                  </div>
                </div>
              </div>
              <div className={styles.forthComponent}>
                <div className={styles.linebetween} />
                <div className={styles.status}>
                  {" "}
                  My status : {userRide.status_Request}
                </div>
              </div>
              <div className={styles.fifthComponent}>
                <div className={styles.linebetween} />
                <div className={styles.space_between_text}>
                  <div className={styles.number_Plate}>
                    {userRide.vehicle.No_Plate}
                  </div>
                  <div className={styles.caricon}>
                    <Image src={car} width={50} height={50} alt="car image" />
                  </div>
                </div>
                <div className={styles.carName}>
                  {userRide.vehicle.model} {userRide.vehicle.name}
                </div>
              </div>
              <div className={styles.sixComponent}>
                <div className={styles.linebetween} />
                <div className={styles.cotravellarText}>co-travellers</div>
              </div>
              {userRide.ride.occupation.length === 0 ? (
                <div className={styles.no_passanger}>
                  There are no passengers yet.
                </div>
              ) : (
                userRide.ride.occupation.map((occupant: any, index: number) => (
                  <div
                    className={styles.co_travellersBorder}
                    key={occupant._id}
                  >
                    <div className={styles.space_between}>
                      <div className={styles.passangerName}>
                        {occupant.user.user_name}
                      </div>
                      <div className={styles.img}>
                        <Image
                          src={occupant.user.image || profileImage}
                          className={styles.avater}
                          width={40}
                          height={34}
                          alt={`Picture of ${occupant.user.user_name}`}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}

              <div className={styles.lastComponent}>
                <div className={styles.linebetween} />
                <button
                  style={{
                    padding: "5px",
                    width: "150px",
                    height: "40px",
                    borderRadius: "10px",
                    color: "white",
                    backgroundColor: "red",
                    border: "none",
                    marginLeft: "40%",
                    marginTop: "10px",
                  }}
                  onClick={handleCancelEvent}
                  disabled={
                    userRide.status_Request === "Awaiting Approval" ||
                    userRide.status_Request === "Approve"
                      ? false
                      : true
                  }
                >
                  cancle the request
                </button>
                {showModal && (
                  <CancelRideModal
                    onCancel={handleCancel}
                    onDelete={handleDelete}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div> no data</div>
      )}
    </div>
  );
}
