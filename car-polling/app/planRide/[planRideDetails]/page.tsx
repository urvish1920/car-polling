"use client";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import styles from "./planRideDetails.module.css";
import { useEffect, useRef, useState } from "react";
import FormattedDate from "@/app/component/Formate";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import profileImage from "../../assert/avater.png";
import { AppDispatch, RootState } from "@/app/redux/store";
import { fetchPlanRides } from "@/app/redux/slice/planRideDetailsReducer";
import { fetchRequestUser } from "@/app/redux/slice/approvalUserReducer";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CircularProgress from "@mui/material/CircularProgress";
import ChatIcon from "@mui/icons-material/Chat";
import ChatBox from "@/app/component/Chat";
import { BASE_URL } from "@/app/utils/apiutils";
export default function planRideDetails({
  params,
}: {
  params: { planRideDetails: string };
}) {
  const id = params.planRideDetails;
  const dispatch: AppDispatch = useDispatch();
  const ride = useSelector((state: any) => state.PlanRide.rides);
  const request = useSelector((state: RootState) => state.RequestUser.request);
  const [isPending, setIsPending] = useState(true);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [recipientId, setRecipientId] = useState<string>("");

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
      const response = await fetch(`${BASE_URL}/rides/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          ride_status: status,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message);
        throw new Error(`Server responded with status ${response.status}`);
      }
      if (response.ok) {
        alert(data.message);
      }
    } catch (error: any) {
      console.error("Signup failed:", error.message);
    }
  };

  const openPopup = (recipientId: string) => {
    setIsPopupOpen(true);
    setRecipientId(recipientId);
    console.log(recipientId);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  return (
    <div>
      <h1 className={styles.heading}>Ride plan</h1>
      {isPending ? (
        <div className={styles.loading}>
          <CircularProgress color="inherit" />
        </div>
      ) : (
        <div className={styles.otcenter}>
          <div className={styles.outercontainer}>
            <div className={styles.request}>
              <div className={styles.col}>
                <div className={styles.notification}>
                  <NotificationsNoneRoundedIcon />
                  {request.length > 0 && (
                    <div className={styles.notificationCount}>
                      {request.length}
                    </div>
                  )}
                </div>
                <div>
                  <div className={styles.bookingRequest}>
                    New Booking Request
                  </div>
                  {request.length === 0 ? (
                    <div>No booking request yet</div>
                  ) : (
                    Array.isArray(request) &&
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
                  <div>
                    <div className={styles.innerupplace}>
                      {ride.pick_up.city}
                      <div className={styles.fullAddress}>
                        {ride.pick_up.fullAddress}
                      </div>
                    </div>
                  </div>
                  <div className={styles.innerdownplace}>
                    {ride.drop_off.city}
                    <div className={styles.fullAddress}>
                      {ride.drop_off.fullAddress}
                    </div>
                  </div>
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
                <div className={styles.co_travellersBorder} key={index}>
                  <div className={styles.space_between}>
                    <div className={styles.passangerName}>
                      {occupant.user.user_name.charAt(0).toUpperCase() +
                        occupant.user.user_name.slice(1)}

                      <ChatIcon
                        className={styles.chatIcon}
                        onClick={() => openPopup(occupant.user._id)}
                      />
                    </div>
                    {isPopupOpen && (
                      <div className={styles.overlay}>
                        <div className={styles.popup}>
                          <ChatBox
                            reciverId={recipientId}
                            onClose={closePopup}
                          />
                        </div>
                      </div>
                    )}
                    <div className={styles.img}>
                      <Image
                        src={occupant.user.image || profileImage}
                        className={styles.avater}
                        width={50}
                        height={50}
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
