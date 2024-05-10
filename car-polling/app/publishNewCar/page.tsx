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
import Stepper from "@mui/material/Stepper/Stepper";
import Step from "@mui/material/Step/Step";
import StepLabel from "@mui/material/StepLabel/StepLabel";
import Box from "@mui/material/Box/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import Image from "next/image";
import car_bg from "../assert/bg_car_publiser.svg";
import location from "../assert/location_icon.svg";
import moneyIcon from "../assert/sort_price.svg";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import dayjs from "dayjs";

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

  const dispatch = useDispatch();
  const step = useSelector((state: RootState) => state.step);
  const publish = useSelector((state: RootState) => state.publish);

  const stepStyle = {
    marginTop: "20px",
    "& .Mui-active": {
      "&.MuiStepIcon-root": {
        color: "warning.main",
        fontSize: "2rem",
      },
    },
    "& .Mui-completed": {
      "&.MuiStepIcon-root": {
        color: "green",
        fontSize: "2rem",
      },
    },
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const priceValue = parseInt(e.target.value, 10);
    dispatch(setPublish({ price: priceValue }));
  };
  const handleVehicleClick = (vehicleId: string) => {
    dispatch(setPublish({ vehicle_id: vehicleId }));
    alert("car is added");
  };

  const onNext = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (step !== 7) {
      console.log(step);
      dispatch(setStep(step + 1));
    }
  };
  const publishRide = async (e: React.MouseEvent<HTMLButtonElement>) => {
    if (step === 3) {
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
    <div className={styles.main_container}>
      <div className={styles.text_publishNewRide}>
        {" "}
        Become a car-polling driver and save on travel costs by <br /> sharing
        your ride with passengers.
      </div>
      <Stepper activeStep={step - 1} alternativeLabel sx={stepStyle}>
        {["Place", "Time & Price", "Car"].map((label, index) => (
          <Step key={label}>
            <StepLabel
              className={step > index ? styles.completedStepLabel : ""}
            >
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      <div className={styles.middle_com}>
        <div className={styles.form_comp}>
          <form className={styles.forminput}>
            {step === 1 && (
              <div>
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
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Box
                      sx={{
                        "& > :not(style)": {
                          m: 1,
                          width: "250px",
                          marginTop: "30px",
                        },
                      }}
                    >
                      <TextField
                        id="pick_up"
                        name="pick_up"
                        type="text"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Image
                                src={location}
                                height={20}
                                width={20}
                                alt={`Location`}
                              />
                            </InputAdornment>
                          ),
                        }}
                        placeholder="Leaving from"
                        variant="standard"
                        sx={{
                          "& input": {
                            fontSize: "18px",
                            fontWeight: "bold",
                            margin: "10px",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Autocomplete>
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
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Box
                      sx={{
                        "& > :not(style)": {
                          m: 1,
                          width: "250px",
                          marginTop: "20px",
                        },
                      }}
                    >
                      <TextField
                        id="drop_off"
                        name="drop_off"
                        type="text"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Image
                                src={location}
                                height={20}
                                width={20}
                                alt={`Location`}
                              />
                            </InputAdornment>
                          ),
                        }}
                        placeholder="Going to"
                        variant="standard"
                        sx={{
                          "& input": {
                            fontSize: "18px",
                            fontWeight: "bold",
                            margin: "10px",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </Autocomplete>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box
                    sx={{
                      "& > :not(style)": {
                        m: 1,
                        width: "250px",
                        marginTop: "20px",
                      },
                    }}
                  >
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="when"
                        value={
                          publish.planride_date
                            ? dayjs(publish.planride_date)
                            : null
                        }
                        onChange={(date) => {
                          const selectedDate = date ? date.toDate() : null;
                          dispatch(setPublish({ planride_date: selectedDate }));
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            border: "none",
                            "&:hover": {
                              border: "none",
                            },
                          },
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
              </div>
            )}
            {step === 2 && (
              <div>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box
                    sx={{
                      "& > :not(style)": {
                        m: 1,
                        width: "250px",
                        marginTop: "5px",
                      },
                    }}
                  >
                    <label className={styles.input_label}>pick up ?</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileTimePicker
                        name="start_time"
                        defaultValue={
                          publish.start_time
                            ? dayjs(publish.start_time, "HH:mm")
                            : null
                        }
                        value={
                          publish.start_time
                            ? dayjs(publish.start_time, "HH:mm")
                            : null
                        }
                        onChange={(time) => {
                          const selectedTime = time
                            ? time.format("hh:mm A")
                            : null;
                          dispatch(setPublish({ start_time: selectedTime }));
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box
                    sx={{
                      "& > :not(style)": {
                        m: 1,
                        width: "250px",
                        marginTop: "5px",
                      },
                    }}
                  >
                    <label className={styles.input_label}>Drop off?</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <MobileTimePicker
                        name="end_time"
                        defaultValue={
                          publish.end_time
                            ? dayjs(publish.end_time, "HH:mm")
                            : null
                        }
                        value={
                          publish.end_time
                            ? dayjs(publish.end_time, "HH:mm")
                            : null
                        }
                        onChange={(time) => {
                          const selectedTime = time
                            ? time.format("hh:mm A")
                            : null;
                          dispatch(setPublish({ end_time: selectedTime }));
                        }}
                      />
                    </LocalizationProvider>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Box
                    sx={{
                      "& > :not(style)": {
                        m: 1,
                        width: "250px",
                        marginTop: "5px",
                        alignItems: "center",
                      },
                    }}
                  >
                    <TextField
                      id="price"
                      name="price"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Image
                              src={moneyIcon}
                              height={20}
                              width={20}
                              alt={`money`}
                            />
                          </InputAdornment>
                        ),
                      }}
                      value={isNaN(publish.price) ? "" : publish.price}
                      onChange={handlePriceChange}
                      placeholder="Price"
                      variant="standard"
                      sx={{
                        "& input": {
                          fontSize: "18px",
                          fontWeight: "bold",
                          margin: "10px",
                        },
                      }}
                    />
                  </Box>
                </Box>
              </div>
            )}
            {step === 3 && (
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
                  <div className={styles.not_Found}>
                    No vehicle add car <br /> from profile
                  </div>
                ) : (
                  <div className={styles.otcenter}>
                    {vehicles.map((item, index) => (
                      <div
                        key={index}
                        className={styles.outerContainer}
                        onClick={() => handleVehicleClick(item._id)}
                      >
                        {" "}
                        <div className={styles.no_plate}>{item.No_Plate}</div>
                        <div className={styles.modelname_text}>{item.name}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </form>
          <div className={styles.submit_Button}>
            {step === 3 ? (
              <button className={styles.formbutton} onClick={publishRide}>
                Publish Ride
              </button>
            ) : (
              <button className={styles.formbutton} onClick={onNext}>
                Continue
              </button>
            )}
          </div>
        </div>
        <div className={styles.car_img}>
          <Image
            src={car_bg}
            className={styles.publish_carbg}
            width={700}
            height={400}
            alt={`Picture of car`}
          />
        </div>
      </div>
      <div className={styles.bt_text}>Drive.Share.Save</div>
    </div>
  );
}
