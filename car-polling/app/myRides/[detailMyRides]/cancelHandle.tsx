import React from "react";
import styles from "./detailsMyRides.module.css";

interface CancelRideModalProps {
  onCancel: () => void;
  onDelete: () => void;
}

const CancelRideModal: React.FC<CancelRideModalProps> = ({
  onCancel,
  onDelete,
}) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p>Are you sure you want to cancel your ride plan?</p>
        <div className={styles.buttonContainer}>
          <button
            style={{
              padding: "5px",
              width: "150px",
              height: "40px",
              borderRadius: "10px",
              border: "none",
              marginTop: "10vh",
              marginLeft: "30px",
              color: "white",
              backgroundColor: "green",
            }}
            onClick={onCancel}
          >
            No, Keep Ride
          </button>
          <button
            style={{
              padding: "5px",
              width: "150px",
              height: "40px",
              borderRadius: "10px",
              border: "none",
              marginTop: "10vh",
              marginLeft: "20px",
              color: "white",
              backgroundColor: "red",
            }}
            onClick={onDelete}
          >
            Yes, Cancel Ride
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelRideModal;
