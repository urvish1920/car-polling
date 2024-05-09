"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";
import { useDispatch } from "react-redux";
import { setSearchData } from "../redux/slice/storeSearchData";
import { Autocomplete } from "@react-google-maps/api";
import InputAdornment from "@mui/material/InputAdornment/InputAdornment";
import TextField from "@mui/material/TextField/TextField";
import Box from "@mui/material/Box/Box";
import Image from "next/image";
import location from "../assert/location_icon.svg";
import person from "../assert/person.svg";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";

interface SearchState {
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
  date: Date;
  passenger: string;
}

const Search = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [search, setSearch] = useState<SearchState>({
    from: {
      city: "",
      fullAddress: "",
      lat: 0,
      lng: 0,
    },
    to: {
      city: "",
      fullAddress: "",
      lat: 0,
      lng: 0,
    },
    date: new Date(),
    passenger: "",
  });
  const [buttonDisabled, setButtonDisable] = useState<boolean>(false);
  const [maxDate, setMaxDate] = useState("");
  const handleSearchData = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    dispatch(setSearchData(search));
    router.push("/findRide");
  };

  const handleDateChange = (newDate: Dayjs | null) => {
    if (newDate) {
      console.log("Selected date:", newDate);
      setSearch({ ...search, date: newDate.toDate() });
    }
  };

  useEffect(() => {
    if (search.passenger.length > 0) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [search]);

  const handlefromPlaceChanged = (place: google.maps.places.PlaceResult) => {
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

    setSearch({
      ...search,
      from: {
        city,
        fullAddress,
        lat,
        lng,
      },
    });
  };

  const handletoPlaceChanged = (place: google.maps.places.PlaceResult) => {
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

    setSearch({
      ...search,
      to: {
        city,
        fullAddress,
        lat,
        lng,
      },
    });
  };

  const fromAutocompleteRef = useRef<google.maps.places.Autocomplete>();
  const toAutocompleteRef = useRef<google.maps.places.Autocomplete>();

  return (
    <form className={styles.forminputfield}>
      <Autocomplete
        onLoad={(autocomplete) => {
          console.log("Autocomplete loaded:", autocomplete);
          fromAutocompleteRef.current = autocomplete;
        }}
        onPlaceChanged={() => {
          const place = fromAutocompleteRef.current?.getPlace();
          console.log(place);
          if (place) {
            handlefromPlaceChanged(place);
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
              },
            }}
          >
            <TextField
              id="from"
              type="text"
              InputProps={{
                style: {
                  border: "none",
                  fontSize: "18px",
                  fontWeight: "bold",
                  outline: "none",
                  boxShadow: "none",
                },
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
              variant="outlined"
            />
          </Box>
        </Box>
      </Autocomplete>
      <Autocomplete
        onLoad={(autocomplete) => {
          console.log("Autocomplete loaded:", autocomplete);
          toAutocompleteRef.current = autocomplete;
        }}
        onPlaceChanged={() => {
          const place = toAutocompleteRef.current?.getPlace();
          console.log(place);
          if (place) {
            handletoPlaceChanged(place);
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
              },
            }}
          >
            <TextField
              id="to"
              type="text"
              InputProps={{
                style: {
                  fontSize: "18px",
                  fontWeight: "bold",
                },
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
              variant="outlined"
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
            },
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="when"
              value={dayjs(search.date)}
              onChange={handleDateChange}
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
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box
          sx={{
            "& > :not(style)": {
              m: 1,
              width: "250px",
            },
          }}
        >
          <TextField
            id="passenger"
            type="text"
            InputProps={{
              style: {
                fontSize: "18px",
                fontWeight: "bold",
              },
              startAdornment: (
                <InputAdornment position="start">
                  <Image src={person} height={20} width={20} alt={`person`} />
                </InputAdornment>
              ),
            }}
            value={search.passenger}
            onChange={(e) =>
              setSearch({ ...search, passenger: e.target.value })
            }
            placeholder="Passenger"
            variant="outlined"
          />
        </Box>
      </Box>
      <button
        onClick={handleSearchData}
        className={styles.searchButton}
        disabled={buttonDisabled}
      >
        Search
      </button>
    </form>
  );
};

export default Search;
