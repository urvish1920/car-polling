"use client";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import styles from "./planRideDetails.module.css";
import { useEffect, useState } from "react";
import FormattedDate from "@/app/component/Formate";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import profileImage from "../../assert/avater.png";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchPlanRides } from "@/app/redux/slice/planRideDetailsReducer";
import { fetchRequestUser } from "@/app/redux/slice/approvalUserReducer";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default function planRideDetails({
  params,
}: {
  params: { planRideDetails: string };
}) {
  const id = params.planRideDetails;
  console.log(id);
  const dispatch: AppDispatch = useDispatch();
  const ride = useSelector((state: any) => state.PlanRide.rides);
  const request = useSelector((state: RootState) => state.RequestUser.request);
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
    dispatch(fetchRequestUser(id))
      .then(() => {
        setIsPending(false);
      })
      .catch((err: Error & { Digest?: string; message: string }) => {
        console.log(err.message);
      });
  }, [dispatch, id]);

  const handleStatus = async (status: string) => {
    try {
      const response = await fetch(`http://localhost:8000/rides/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ride_status: status,
        }),
      });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      if (response.ok) {
        alert(`Ride was ${status}`);
      }
    } catch (error: any) {
      console.error("Signup failed:", error.message);
    }
  };

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
                  {request.length === 0 ? (
                    <div>No booking request yet</div>
                  ) : (
                    request.map((item, index) => (
                      <button
                        key={index}
                        className={styles.replay}
                        onClick={() =>
                          router.push(`[planRideDetails]/${item._id}`)
                        }
                      >
                        Replay to {item.user.user_name}{" "}
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
            <div className={styles.secondcontainer}>
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
            <div className={styles.thirdComponent}>
              <div className={styles.linebetween} />
              <div className={styles.ride_status}>Ride status</div>
              <div className={styles.space_between}>
                <div className={styles.labeltext}>your Ride is Started ?</div>
                <button
                  className={styles.updatebutton}
                  onClick={() => handleStatus("started")}
                >
                  started
                </button>
              </div>
              <div className={styles.space_between}>
                <div className={styles.labeltext}>your Ride is completed ?</div>
                <button
                  className={styles.updatebutton}
                  onClick={() => handleStatus("completed")}
                >
                  completed
                </button>
              </div>
            </div>
            <div className={styles.lastComponent}>
              <div className={styles.linebetween} />
              <div className={styles.co_travellers}>co-travellers</div>
              {ride.occupation.map((occupant: any, index: number) => (
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
                        alt={`Picture of ${occupant.user_name}`}
                      />
                      <div className={styles.arrow}>
                        <ChevronRightIcon
                          style={{ fontSize: "2rem" }}
                          onClick={() => {
                            router.push(`/${occupant._id}`);
                          }}
                        />
                      </div>
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
