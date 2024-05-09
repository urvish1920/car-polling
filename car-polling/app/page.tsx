"use client";
import { useDispatch, useSelector } from "react-redux";
import Styles from "./(home)/home.module.css";
import Search from "./(home)/search";
import { AppDispatch, RootState } from "./redux/store";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress/CircularProgress";
import Image from "next/image";
import home_image from "../app/assert/car-polling.png";
import money_icon from "../app/assert/price.svg";
import contect_icon from "../app/assert/contect.svg";
import energy_icon from "../app/assert/energy.svg";
import person from "../app/assert/person.svg";
import car from "../app/assert/car.png";
import request from "../app/assert/request.svg";
import ButtonGroup from "@mui/material/ButtonGroup/ButtonGroup";
import { useRouter } from "next/navigation";
import { fetchTotalData } from "./redux/slice/totalCountAdminReducer";

export default function Home() {
  const [isPending, setIsPending] = useState(true);

  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const totalCount = useSelector((state: RootState) => state.totalDateAdmin);
  const router = useRouter();

  if (user?.IsAdmin) {
    useEffect(() => {
      dispatch(fetchTotalData())
        .then(() => {
          setIsPending(false);
        })
        .catch((err: Error & { Digest?: string; message: string }) => {
          console.log(err.message);
        });
    }, [dispatch]);

    return (
      <div className={Styles.home}>
        {isPending ? (
          <div className={Styles.loading}>
            <CircularProgress color="inherit" />
          </div>
        ) : (
          <div className={Styles.inner_container}>
            <Image
              src={home_image}
              className={Styles.homeImage}
              alt="carpolling"
            />
            <div className={Styles.overlayText}>
              <span className={Styles.home_maintext}>
                Carpool to thousands of destinations at low prices
              </span>
            </div>
            <div className={Styles.search_main_com}>
              <ButtonGroup
                variant="contained"
                aria-label="Basic button group"
                sx={{ borderRadius: "10px" }}
              >
                <button
                  className={Styles.button_admin}
                  onClick={() => {
                    router.push(`/allUser`);
                  }}
                >
                  <Image
                    src={person}
                    height={20}
                    width={20}
                    alt={`person`}
                    className={Styles.img_admin}
                  />
                  <div className={Styles.text_admin}>No User:{""}</div>
                  {totalCount?.totalData?.totalUsers}
                </button>
                <button
                  className={Styles.button_admin}
                  onClick={() => {
                    router.push(`/allPlanRide`);
                  }}
                >
                  <Image
                    src={car}
                    width={30}
                    height={30}
                    alt="car image"
                    className={Styles.img_admin}
                  />
                  <div className={Styles.text_admin}>No Rides:{""}</div>
                  {totalCount?.totalData?.totalRides}
                </button>
                <button
                  className={Styles.button_admin}
                  onClick={() => {
                    router.push(`/allRequest`);
                  }}
                >
                  <Image
                    src={request}
                    width={30}
                    height={30}
                    alt="car image"
                    className={Styles.img_admin}
                  />
                  <div className={Styles.text_admin}>No Request:{""}</div>
                  {totalCount?.totalData?.totalRequests}
                </button>
              </ButtonGroup>
            </div>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div className={Styles.inner_container}>
        <Image src={home_image} className={Styles.homeImage} alt="carpolling" />
        <div className={Styles.overlayText}>
          <span className={Styles.home_maintext}>
            Carpool to thousands of destinations at low prices
          </span>
        </div>
        <div className={Styles.search_main_com}>
          <ButtonGroup
            variant="contained"
            aria-label="Basic button group"
            sx={{ borderRadius: "10px" }}
          >
            <Search />
          </ButtonGroup>
        </div>
        <div className={Styles.main_text_com}>
          <div className={Styles.out_com}>
            <Image src={money_icon} width={40} height={40} alt="money icon" />
            <div className={Styles.text_comp}>
              <div className={Styles.text_heading}>
                Your pick of rides at low prices
              </div>
              <div className={Styles.text_inner}>
                No matter where you’re going, by bus or <br /> carpool, find the
                perfect ride from our <br /> wide range of destinations and
                routes
                <br />
                at low prices.
              </div>
            </div>
          </div>
          <div className={Styles.out_com}>
            <Image
              src={contect_icon}
              width={35}
              height={35}
              alt="contect icon"
            />
            <div className={Styles.text_comp}>
              <div className={Styles.text_heading}>
                Trust who you travel with
              </div>
              <div className={Styles.text_inner}>
                We take the time to get to know each of
                <br /> our members and partners. We
                <br /> check reviews, profiles and IDs, so you
                <br /> know who you’re travelling with and can
                <br /> book your ride at ease on our secure
                <br /> platform.
              </div>
            </div>
          </div>
          <div className={Styles.out_com}>
            <Image src={energy_icon} width={35} height={35} alt="energy icon" />
            <div className={Styles.text_comp}>
              <div className={Styles.text_heading}>
                Scroll, click, tap and go!
              </div>
              <div className={Styles.text_inner}>
                Booking a ride has never been easier!
                <br /> Thanks to our simple app powered by
                <br /> great technology, you can book a ride
                <br /> close to you in just minutes.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
