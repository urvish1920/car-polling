"use client";
import { BASE_URL } from "../utils/apiutils";
import styles from "./updateStatus.module.css";
export default function ApprovalRequest({
  params,
}: {
  params: { updateStatus: string };
}) {
  const id = params.updateStatus;

  const handleStatus = async (status: string) => {
    try {
      let requestBody: { my_status: string; status_Request?: string } = {
        my_status: status,
      };
      if (status === "Exchange Ratings") {
        requestBody = { ...requestBody, status_Request: status };
      }
      const response = await fetch(`${BASE_URL}/request/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
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
      alert(error);
      console.error("update failed:", error.message);
    }
  };

  return (
    <div>
      <div>
        <h1 className={styles.heading}>Update User Status</h1>
        <div className={styles.otcenter}>
          <div className={styles.outercontainer}>
            <div className={styles.inner_conUpdate}>
              <div className={styles.linebetween} />
              <div className={styles.space_between}>
                <div className={styles.labeltext}>you pickup the user ? </div>
                <button
                  className={styles.updatebutton}
                  onClick={() => handleStatus("Start")}
                >
                  pick-up
                </button>
              </div>
            </div>
            <div className={styles.inner_conUpdate}>
              <div className={styles.linebetween} />
              <div className={styles.space_between}>
                <div className={styles.labeltext}>you Dropoff the user ? </div>
                <button
                  className={styles.updatebutton}
                  onClick={() => handleStatus("completed")}
                >
                  drop-down
                </button>
              </div>
            </div>
            <div className={styles.inner_conUpdate}>
              <div className={styles.linebetween} />
              <div className={styles.space_between}>
                <div className={styles.labeltext}>
                  payment of user completed ?
                </div>
                <button
                  className={styles.updatebutton}
                  onClick={() => handleStatus("Exchange Ratings")}
                >
                  payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
