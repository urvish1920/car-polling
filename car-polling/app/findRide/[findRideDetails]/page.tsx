"use client";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import profileImage from "../../assert/avater.png";
import icon from "../../assert/icon.png";
import car from "../../assert/car.png";
import styles from "./findRideDetails.module.css";
import FormattedDate from "@/app/component/Formate";
import { fetchFindRides } from "@/app/redux/slice/findRideDetailsReducer";
import { AppDispatch } from "@/app/redux/store";

export default function FullDetailRide({
  params,
}: {
  params: { findRideDetails: string };
}) {
  const id = params.findRideDetails;
  const dispatch: AppDispatch = useDispatch();
  const ride = useSelector((state: any) => state.findRide.rides);
  console.log(ride);
  const [isPending, setIsPending] = useState(true);
  const router = useRouter();
  useEffect(() => {
    dispatch(fetchFindRides(id))
      .then(() => {
        setIsPending(false);
      })
      .catch((err: Error & { Digest?: string; message: string }) => {
        console.log(err.message);
      });
  }, [dispatch, id]);

  return (
    <div>
      {isPending ? (
        "loading..."
      ) : (
        <div>
          <h1 className={styles.heading}>
            <FormattedDate date={new Date(ride.planride_date)} />
          </h1>
          <div className={styles.otcenter}>
            <div className={styles.outercontainer}>
              <div className={styles.firstcontainer}>
                <div className={styles.date}>
                  <FormattedDate date={new Date(ride.planride_date)} />
                </div>
                <div className={styles.col}>
                  <div className={styles.timecol}>
                    <div className={styles.inneruptime}>{ride.start_time}</div>
                    <div className={styles.innerdowntime}>{ride.end_time}</div>
                  </div>
                  <div className={styles.divider}>
                    <div className={styles.box} />
                    <div className={styles.line} />
                    <div className={styles.box2} />
                  </div>
                  <div className={styles.loccol}>
                    <div className={styles.innerupplace}>{ride.pick_up}</div>
                    <div className={styles.innerdownplace}>{ride.drop_off}</div>
                  </div>
                </div>
              </div>
              <div className={styles.secondComponent}>
                <div className={styles.linebetween} />
                <div className={styles.space_between_text}>
                  <div className={styles.priceText}>
                    Total Price for 1 Passenger
                  </div>
                  <div className={styles.price}>&#8377;{ride.price}</div>
                </div>
              </div>
              <div className={styles.thirdComponent}>
                <div className={styles.linebetween} />
                <div className={styles.space_between_text}>
                  <div className={styles.username}>{ride.user.user_name}</div>
                  <div className={styles.owner_img}>
                    <Image
                      src={profileImage}
                      className={styles.owner_avater}
                      width={40}
                      height={34}
                      alt="Picture of the author"
                    />
                  </div>
                </div>
                <div className={styles.chat}>
                  <Button
                    className={styles.chatButton}
                    style={{ marginLeft: "5px", marginTop: "5px" }}
                  >
                    <Image
                      src={icon}
                      className={styles.chaticon}
                      alt="chat image"
                    />
                    <div className={styles.chatMessage}>
                      Ask yash a question
                    </div>
                  </Button>
                </div>
              </div>
              <div className={styles.forthComponent}>
                <div className={styles.linebetween} />
                <div className={styles.space_between_text}>
                  <div className={styles.number_Plate}>
                    {ride.vehicle.No_Plate}
                  </div>
                  <div className={styles.caricon}>
                    <Image src={car} width={50} height={50} alt="car image" />
                  </div>
                </div>
                <div className={styles.carName}>
                  {ride.vehicle.model} {ride.vehicle.name}
                </div>
              </div>
              <div className={styles.fifthComponent}>
                <div className={styles.linebetween} />
                <div className={styles.cotravellarText}>co-travellers</div>
              </div>
              {ride.occupation.length === 0 ? (
                <div className={styles.no_passanger}>
                  There are no passengers yet.
                </div>
              ) : (
                ride.occupation.map((occupant: any, index: number) => (
                  <div className={styles.co_travellersBorder}>
                    <div className={styles.space_between} key={index}>
                      <div className={styles.passangerName}>
                        {occupant.user.user_name}
                      </div>
                      <div className={styles.img}>
                        <Image
                          src={occupant.profileImage || profileImage}
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
                    backgroundColor: "darkslategrey",
                    border: "none",
                    marginLeft: "40%",
                    marginTop: "10px",
                  }}
                  onClick={() => router.push(`/findRide/${id}/findRideSummary`)}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
