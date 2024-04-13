"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";
import { useDispatch } from "react-redux";
import { setSearchData } from "../redux/slice/storeSearchData";
import { Autocomplete } from "@react-google-maps/api";

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

  useEffect(() => {
    if (search.passenger.length > 0) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [search]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({ ...search, date: e.target.valueAsDate || new Date() });
  };
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
    <div className={styles.meanCom}>
      <form>
        <div className={styles.innCom}>
          <div className={styles.placeInputField}>
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
              <input
                className={styles.inputField}
                id="from"
                type="text"
                placeholder="from"
              />
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
              <input
                className={styles.inputField}
                id="to"
                type="text"
                placeholder="to"
              />
            </Autocomplete>
          </div>
        </div>
        <div className={styles.innCom}>
          <input
            className={styles.inputField}
            id="date"
            type="date"
            value={search.date.toISOString().slice(0, 10)}
            min={maxDate}
            onChange={handleDateChange}
            placeholder="dd-mm-yyyy"
          />
          <input
            className={styles.inputField}
            id="passenger"
            type="text"
            value={search.passenger}
            onChange={(e) =>
              setSearch({ ...search, passenger: e.target.value })
            }
            placeholder="No of Passenger"
          />
          <button
            onClick={handleSearchData}
            className={styles.searchButton}
            disabled={buttonDisabled}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  );
};

export default Search;
