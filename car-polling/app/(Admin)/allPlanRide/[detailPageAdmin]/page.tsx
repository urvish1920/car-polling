"use client";
import styles from "./detailpagePlanRide.module.css";
import { useEffect, useState } from "react";
import FormattedDate from "@/app/component/Formate";
import { useRouter } from "next/navigation";
import Image from "next/image";
import profileImage from "../../../assert/avater.png";
import CircularProgress from "@mui/material/CircularProgress";
import { Ride } from "@/app/redux/slice/planRideDetailsReducer";

export default function RideDetails({
  params,
}: {
  params: { detailPageAdmin: string };
}) {
  const id = params.detailPageAdmin;
  const [isPending, setIsPending] = useState(true);
  const [ride, setRide] = useState<Ride>();

  const router = useRouter();
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await fetch(`http://localhost:8000/rides/${id}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          const data = await response.json();
          console.log(data);
          setRide(data);
          setIsPending(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsPending(false);
      }
    };
    fetchDetail();
  }, [id]);

  return (
    <div>
      <h1 className={styles.heading}>Ride Detail</h1>
      {isPending ? (
        <div className={styles.loading}>
          <CircularProgress color="inherit" />
        </div>
      ) : (
        <div className={styles.otcenter}>
          <div className={styles.outercontainer}>
            <div className={styles.firstcontainer}>
              <div className={styles.date}>
                {ride?.planride_date && (
                  <FormattedDate date={new Date(ride.planride_date)} />
                )}
              </div>
              <div className={styles.col}>
                <div className={styles.timecol}>
                  <div className={styles.inneruptime}>{ride?.start_time}</div>
                  <div className={styles.innerdowntime}>{ride?.end_time}</div>
                </div>
                <div className={styles.divider}>
                  <div className={styles.box} />
                  <div className={styles.line} />
                  <div className={styles.box2} />
                </div>
                <div className={styles.loccol}>
                  <div>
                    <div className={styles.innerupplace}>
                      {ride?.pick_up.city}
                      <div className={styles.fullAddress}>
                        {ride?.pick_up.fullAddress}
                      </div>
                    </div>
                  </div>
                  <div className={styles.innerdownplace}>
                    {ride?.drop_off.city}
                    <div className={styles.fullAddressDown}>
                      {ride?.drop_off.fullAddress}
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
                <div className={styles.price}>&#8377;{ride?.price}</div>
              </div>
            </div>
            <div className={styles.thirdComponent}>
              <div className={styles.linebetween} />
              <div className={styles.space_between_text}>
                <div className={styles.username}>
                  {ride?.user?.user_name &&
                    ride.user.user_name.charAt(0).toUpperCase() +
                      ride.user.user_name.slice(1)}
                </div>
                <div className={styles.owner_img}>
                  <Image
                    src={ride?.user.image.toString() || profileImage}
                    className={styles.owner_avater}
                    width={50}
                    height={47}
                    alt="User Profile"
                  />
                </div>
              </div>
            </div>
            <div className={styles.thirdComponent}>
              <div className={styles.linebetween} />
              <div className={styles.ride_status}>Ride status</div>
              <div className={styles.statesRide}>{ride?.ride_status}</div>
            </div>
            <div className={styles.lastComponent}>
              <div className={styles.linebetween} />
              <div className={styles.co_travellers}>co-travellers</div>
              {ride?.occupation.map((occupant: any, index: number) => (
                <div className={styles.co_travellersBorder}>
                  <div className={styles.space_between} key={index}>
                    <div className={styles.passangerName}>
                      {occupant.user.user_name.charAt(0).toUpperCase() +
                        occupant.user.user_name.slice(1)}
                    </div>
                    <div className={styles.img}>
                      <Image
                        src={occupant.user.image || profileImage}
                        className={styles.avater}
                        width={50}
                        height={50}
                        alt={`Picture of ${occupant.user_name}`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
