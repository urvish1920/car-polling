"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./publishNewCar.module.css";
import { useRouter } from "next/navigation";
import { Autocomplete } from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import { setStep } from "../redux/slice/stepReducer";
import { setPublish } from "../redux/slice/publishReducer";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import { RootState } from "../redux/store";
import { BASE_URL } from "../utils/apiutils";

interface vehicle {
  _id: string;
  user_id: string;
  name: string;
  No_Plate: string;
  model: string;
  seaters: number;
}

export default function publishNewCar() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<vehicle[]>([]);
  const [isPending, setIsPending] = useState(true);
  const [maxDate, setMaxDate] = useState("");
  const [button_dis, setButton_dis] = useState(false);

  const dispatch = useDispatch();
  const step = useSelector((state: RootState) => state.step);
  const publish = useSelector((state: RootState) => state.publish);

  useEffect(() => {
    const dtToday = new Date();
    const month = dtToday.getMonth() + 1;
    const day = dtToday.getDate();
    const year = dtToday.getFullYear();
    const formattedMonth = month < 10 ? `0${month}` : month.toString();
    const formattedDay = day < 10 ? `0${day}` : day.toString();
    const maxDateString = `${year}-${formattedMonth}-${formattedDay}`;
    setMaxDate(maxDateString);
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPublish({ planride_date: e.target.valueAsDate || new Date() }));
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const priceValue = parseInt(e.target.value, 10);
    dispatch(setPublish({ price: priceValue }));
  };
  const handleVehicleClick = (vehicleId: string) => {
    dispatch(setPublish({ vehicle_id: vehicleId }));
  };

  const onNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step !== 7) {
      console.log(step);
      dispatch(setStep(step + 1));
    }
  };
  const publishRide = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (step === 7) {
      e.preventDefault();
      try {
        const response = await fetch(`${BASE_URL}/rides`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(publish),
        });
        const data = await response.json();
        if (response.ok && response.status === 200) {
          alert(data.message);
          setButton_dis(true);
          dispatch(
            setPublish({
              pick_up: { city: "", fullAddress: "", lat: 0, lng: 0 },
            })
          );
          dispatch(
            setPublish({
              drop_off: { city: "", fullAddress: "", lat: 0, lng: 0 },
            })
          );
          dispatch(setPublish({ planride_date: new Date() }));
          dispatch(setPublish({ start_time: "" }));
          dispatch(setPublish({ end_time: "" }));
          dispatch(setPublish({ price: 0 }));
          dispatch(setPublish({ vehicle_id: "" }));
          dispatch(setStep(1));
          router.push("/");
        } else {
          alert(data.message);
          dispatch(
            setPublish({
              pick_up: { city: "", fullAddress: "", lat: 0, lng: 0 },
            })
          );
          dispatch(
            setPublish({
              drop_off: { city: "", fullAddress: "", lat: 0, lng: 0 },
            })
          );
          dispatch(setPublish({ planride_date: new Date() }));
          dispatch(setPublish({ start_time: "" }));
          dispatch(setPublish({ end_time: "" }));
          dispatch(setPublish({ price: 0 }));
          dispatch(setPublish({ vehicle_id: "" }));
          dispatch(setStep(1));
          router.push("/");
        }
      } catch (error: any) {
        alert(error);
      }
    }
  };

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch(`${BASE_URL}/vehicle`, {
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

  const handlePickupPlaceChanged = (place: google.maps.places.PlaceResult) => {
    const cityComponent = place.address_components?.find((component) =>
      component.types.includes("locality")
    );
    let city = "";
    if (cityComponent) {
      city = cityComponent.long_name;
    } else {
      const adminAreaComponent = place.address_components?.find((component) =>
        component.types.includes("administrative_area_level_1")
      );
      if (adminAreaComponent) {
        city = adminAreaComponent.long_name;
      }
    }

    const fullAddress = place.formatted_address || "";
    const lat = place.geometry?.location?.lat() || 0;
    const lng = place.geometry?.location?.lng() || 0;

    dispatch(
      setPublish({
        pick_up: {
          city,
          fullAddress,
          lat,
          lng,
        },
      })
    );
  };

  const handledropoffPlaceChanged = (place: google.maps.places.PlaceResult) => {
    const cityComponent = place.address_components?.find((component) =>
      component.types.includes("locality")
    );
    let city = "";
    if (cityComponent) {
      city = cityComponent.long_name;
    } else {
      const adminAreaComponent = place.address_components?.find((component) =>
        component.types.includes("administrative_area_level_1")
      );
      if (adminAreaComponent) {
        city = adminAreaComponent.long_name;
      }
    }

    const fullAddress = place.formatted_address || "";
    const lat = place.geometry?.location?.lat() || 0;
    const lng = place.geometry?.location?.lng() || 0;

    dispatch(
      setPublish({
        drop_off: {
          city,
          fullAddress,
          lat,
          lng,
        },
      })
    );
  };

  const pickUpcompleteRef = useRef<google.maps.places.Autocomplete>();
  const dropoffcompleteRef = useRef<google.maps.places.Autocomplete>();

  return (
    <>
      <form className={styles.forminput}>
        {step === 1 && (
          <div>
            <label className={styles.input_label}>Enter your Pick-up</label>
            <Autocomplete
              onLoad={(autocomplete) => {
                console.log("Autocomplete loaded:", autocomplete);
                pickUpcompleteRef.current = autocomplete;
              }}
              onPlaceChanged={() => {
                const place = pickUpcompleteRef.current?.getPlace();
                if (place) {
                  handlePickupPlaceChanged(place);
                } else {
                  console.error("Place information is not available.");
                }
              }}
            >
              <input
                className={styles.input}
                id="pick_up"
                name="pick_up"
                type="text"
                placeholder="Enter pickup Location"
              />
            </Autocomplete>
          </div>
        )}
        {step === 2 && (
          <div>
            <label className={styles.input_label}>Enter your Drop-off</label>
            <Autocomplete
              onLoad={(autocomplete) => {
                console.log("Autocomplete loaded:", autocomplete);
                dropoffcompleteRef.current = autocomplete;
              }}
              onPlaceChanged={() => {
                const place = dropoffcompleteRef.current?.getPlace();
                if (place) {
                  handledropoffPlaceChanged(place);
                } else {
                  console.error("Place information is not available.");
                }
              }}
            >
              <input
                className={styles.input}
                id="drop_off"
                name="drop_off"
                type="text"
                placeholder="Enter Drop off Location"
              />
            </Autocomplete>
          </div>
        )}
        {step === 3 && (
          <div>
            <label className={styles.input_label}>When are you going?</label>
            <input
              className={styles.input_date}
              id="planride_date"
              name="planride_date"
              type="date"
              value={
                publish.planride_date instanceof Date
                  ? publish.planride_date.toISOString().slice(0, 10)
                  : ""
              }
              min={maxDate}
              onChange={handleDateChange}
              placeholder="on which Date"
            />
          </div>
        )}
        {step === 4 && (
          <div>
            <label className={styles.input_label}>
              At What time will you pick passenger up ?
            </label>

            <input
              className={styles.timeinput}
              id="start_time"
              name="start_time"
              type="time"
              value={publish.start_time}
              onChange={(e) =>
                dispatch(setPublish({ start_time: e.target.value }))
              }
              placeholder="Pick-up Time"
            />
          </div>
        )}
        {step === 5 && (
          <div>
            <label className={styles.input_label}>
              At What time will you Drop passenger off ?
            </label>
            <input
              className={styles.timeinput}
              id="end_time"
              name="end_time"
              type="time"
              value={publish.end_time}
              onChange={(e) =>
                dispatch(setPublish({ end_time: e.target.value }))
              }
              placeholder="Drop-off Time"
            />
          </div>
        )}
        {step === 6 && (
          <div>
            <label className={styles.input_label}>Price per sites ?</label>
            <input
              className={styles.input_date}
              id="price"
              name="price"
              type="number"
              value={isNaN(publish.price) ? "" : publish.price}
              onChange={handlePriceChange}
              placeholder=" price"
            />
          </div>
        )}
        {step === 7 && (
          <div>
            <div className={styles.heading_button}>
              <label className={styles.input_label}>
                Select your car details from below
              </label>
            </div>
            {isPending ? (
              <div className={styles.loading}>
                <CircularProgress color="inherit" />
              </div>
            ) : vehicles.length === 0 ? (
              <div className={styles.not_Found}>No vehicle</div>
            ) : (
              <div className={styles.otcenter}>
                {vehicles.map((item, index) => (
                  <div
                    key={index}
                    className={styles.outerContainer}
                    onClick={() => handleVehicleClick(item._id)}
                  >
                    {" "}
                    <div>
                      <div className={styles.no_plate}>{item.No_Plate}</div>
                      <div className={styles.modelname_text}>
                        {item.model} {item.name}
                      </div>
                    </div>
                    <div className={styles.seater}>seater : {item.seaters}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </form>
      <div className={styles.submit_Button}>
        {step === 7 ? (
          <button
            className={styles.publishButton}
            onClick={publishRide}
            disabled={button_dis}
          >
            Publish Ride
          </button>
        ) : (
          <button className={styles.formbutton} onClick={onNext}>
            Continue
          </button>
        )}
      </div>
    </>
  );
}
