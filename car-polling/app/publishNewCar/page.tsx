"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./publishNewCar.module.css";
import { useRouter } from "next/navigation";
import { Autocomplete } from "@react-google-maps/api";

export interface PublishState {
  pick_up?: string;
  drop_off?: string;
  planride_date: Date;
  start_time: string;
  end_time: string;
  price: number;
  vehicle_id: string;
}

export interface vehicle {
  _id: string;
  user_id: string;
  name: string;
  No_Plate: string;
  model: string;
  seaters: number;
}

const Form: React.FC = () => {
  const router = useRouter();
  const [publish, setPublish] = useState<PublishState>({
    pick_up: "",
    drop_off: "",
    planride_date: new Date(),
    start_time: "",
    end_time: "",
    price: 0,
    vehicle_id: "",
  });
  const [vehicles, setVehicles] = useState<vehicle[]>([]);

  const [isPending, setIsPending] = useState(true);
  const [step, setStep] = useState(1);
  const [maxDate, setMaxDate] = useState("");
  const [button_dis, setButton_dis] = useState(false);

  console.log(publish);

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
    setPublish({
      ...publish,
      planride_date: e.target.valueAsDate || new Date(),
    });
  };
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const priceValue = parseInt(e.target.value, 10);
    setPublish({ ...publish, price: priceValue });
  };
  const handleVehicleClick = (vehicleId: string) => {
    setPublish({ ...publish, vehicle_id: vehicleId });
  };

  const onNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step !== 7) setStep(step + 1);
  };
  const publishRide = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step === 7) {
      try {
        const response = await fetch("http://localhost:8000/rides", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(publish),
        });
        if (response.ok && response.status === 201) {
          alert("new car published");
          setButton_dis(true);
          router.push("/");
        } else {
          alert("there is some problem retry again");
        }
      } catch (error: any) {
        alert(error);
      }
    }
  };

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

  const handlePickupPlaceChanged = (place: google.maps.places.PlaceResult) => {
    setPublish({ ...publish, pick_up: place.formatted_address });
  };

  const handledropoffPlaceChanged = (place: google.maps.places.PlaceResult) => {
    setPublish({ ...publish, drop_off: place.formatted_address });
  };

  const autocompleteRef = useRef<google.maps.places.Autocomplete>();

  return (
    <>
      <form className={styles.forminput}>
        {step === 1 && (
          <div>
            <label className={styles.input_label}>Enter your Pick-up</label>
            <Autocomplete
              onLoad={(autocomplete) => {
                console.log("Autocomplete loaded:", autocomplete);
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={() => {
                const place = autocompleteRef.current?.getPlace();
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
                value={publish.pick_up}
                onChange={(e) => {
                  setPublish({ ...publish, pick_up: e.target.value });
                }}
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
                autocompleteRef.current = autocomplete;
              }}
              onPlaceChanged={() => {
                const place = autocompleteRef.current?.getPlace();
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
                value={publish.drop_off}
                onChange={(e) =>
                  setPublish({ ...publish, drop_off: e.target.value })
                }
                placeholder="Enter Drop off Location"
              />
            </Autocomplete>
          </div>
        )}
        {step === 3 && (
          <div>
            <label className={styles.input_label}>When are you going?</label>
            <input
              className={styles.input}
              id="planride_date"
              name="planride_date"
              type="date"
              value={publish.planride_date.toISOString().slice(0, 10)}
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
                setPublish({ ...publish, start_time: e.target.value })
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
                setPublish({ ...publish, end_time: e.target.value })
              }
              placeholder="Drop-off Time"
            />
          </div>
        )}
        {step === 6 && (
          <div>
            <label className={styles.input_label}>Price per sites</label>
            <input
              className={styles.input}
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
                Select your car details
              </label>
            </div>
            {isPending ? (
              "loading ....."
            ) : vehicles.length === 0 ? (
              <div className={styles.not_Found}>No vehicle</div>
            ) : (
              vehicles.map((item, index) => (
                <div className={styles.otcenter} key={index}>
                  <div
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
                </div>
              ))
            )}
          </div>
        )}
      </form>
      <div className={styles.submit_Button}>
        {step === 7 ? (
          <button
            className={styles.formbutton}
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
};

export default Form;
