"use client";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import styles from "./planRideDetails.module.css";
import { useEffect, useState } from "react";
import FormattedDate from "@/app/component/Formate";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import profileImage from "../../assert/avater.png";
import { AppDispatch } from "@/app/redux/store";
import { fetchPlanRides } from "@/app/redux/slice/planRideDetailsReducer";

export default function planRideDetails({
  params,
}: {
  params: { planRideDetails: string };
}) {
  const id = params.planRideDetails;
  const dispatch: AppDispatch = useDispatch();
  const ride = useSelector((state: any) => state.PlanRide.rides);
  console.log(ride);
  const [isPending, setIsPending] = useState(true);
  const router = useRouter();
  useEffect(() => {
    dispatch(fetchPlanRides(id))
      .then(() => {
        setIsPending(false);
      })
      .catch((err: Error & { Digest?: string; message: string }) => {
        console.log(err.message);
      });
  }, [dispatch, id]);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const response = await fetch(
          `http://localhost:8000/request/notifationUser/${id}`,
          {
            credentials: "include",
          }
        );
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        } else {
          const data = await response.json();
          console.log(data);
          setIsPending(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsPending(false);
      }
    };
    fetchNotification();
  }, []);

  return (
    <div>
      <h1 className={styles.heading}>Ride plan</h1>
      {isPending ? (
        "loading..."
      ) : (
        <div className={styles.otcenter}>
          <div className={styles.outercontainer}>
            <div className={styles.request}>
              <div className={styles.col}>
                <div className={styles.notification}>
                  <NotificationsNoneRoundedIcon />
                </div>
                <div>
                  <div className={styles.bookingRequest}>
                    New Booking Request
                  </div>
                  <button
                    className={styles.replay}
                    onClick={() => router.push(`[slug]/approvalRequest`)}
                  >
                    Replay to keval
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.middlecontainer}>
              <div className={styles.linebetween} />
              <div className={styles.date}>
                {<FormattedDate date={new Date(ride.planride_date)} />}
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
            <div className={styles.lastComponent}>
              <div className={styles.linebetween} />
              <div className={styles.co_travellers}>co-travellers</div>
              <div className={styles.space_between}>
                <div className={styles.username}>yash</div>
                <div className={styles.img}>
                  <Image
                    src={profileImage}
                    className={styles.avater}
                    width={40}
                    height={34}
                    alt="Picture of the author"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
