"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./home.module.css";
import { useDispatch } from "react-redux";
import { setSearchData } from "../redux/slice/storeSearchData";

interface SearchState {
  from: string;
  to: string;
  date: Date;
  passenger: string;
}

const Search = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [search, setSearch] = useState<SearchState>({
    from: "",
    to: "",
    date: new Date(),
    passenger: "",
  });
  const [buttonDisabled, setButtonDisable] = useState<boolean>(false);
  const [maxDate, setMaxDate] = useState("");
  const handleSearchData = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log(search);
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
    if (
      search.from.length > 0 &&
      search.to.length > 0 &&
      search.passenger.length > 0
    ) {
      setButtonDisable(false);
    } else {
      setButtonDisable(true);
    }
  }, [search]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch({ ...search, date: e.target.valueAsDate || new Date() });
  };

  return (
    <div className={styles.meanCom}>
      <form>
        <div className={styles.innCom}>
          <input
            className={styles.inputField}
            id="from"
            type="text"
            value={search.from}
            onChange={(e) => setSearch({ ...search, from: e.target.value })}
            placeholder="from"
          />
          <input
            className={styles.inputField}
            id="to"
            type="text"
            value={search.to}
            onChange={(e) => setSearch({ ...search, to: e.target.value })}
            placeholder="to"
          />
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
