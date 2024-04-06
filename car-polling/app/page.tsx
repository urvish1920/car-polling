import Styles from "./(home)/home.module.css";
import Search from "./(home)/search";

export default function Home() {
  return (
    <div className={Styles.home}>
      <div className={Styles.inner_container}>
        <span className={Styles.homeheading}>
          Choose Your Perfect Ride Partner
        </span>
        <h1 className={Styles.homeheading_second}>
          Looking For
          <br />A Ride
        </h1>
        <Search />
      </div>
    </div>
  );
}
