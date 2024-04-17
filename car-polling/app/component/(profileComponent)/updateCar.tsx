import { useState, ChangeEvent, FormEvent } from "react";
import { TextField } from "@mui/material";
import styles from "../../profile/userprofile.module.css";

interface CarData {
  name: string;
  model: string;
  color: string;
  No_Plate: string;
  seaters: number;
}

interface UpdateCarPopupProps {
  onClose: () => void;
  onUpdateCar: (carData: CarData) => void;
  vehicle: CarData;
}

const UpdateCarPopup: React.FC<UpdateCarPopupProps> = ({
  onClose,
  onUpdateCar,
  vehicle,
}) => {
  const [carData, setCarData] = useState<CarData>({
    name: vehicle.name,
    No_Plate: vehicle.No_Plate,
    model: vehicle.model,
    color: vehicle.color,
    seaters: vehicle.seaters,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCarData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onUpdateCar(carData);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Update car</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={carData.name}
            onChange={handleChange}
            required
            margin="normal"
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="License Plate"
            name="No_Plate"
            value={carData.No_Plate}
            onChange={handleChange}
            required
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Model"
            name="model"
            value={carData.model}
            onChange={handleChange}
            required
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Color"
            name="color"
            value={carData.color}
            onChange={handleChange}
            required
            style={{ marginBottom: "10px" }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Seaters"
            type="number"
            name="seaters"
            value={carData.seaters}
            onChange={handleChange}
            required
            style={{ marginBottom: "20px" }}
          />
          <div className={styles.buttons}>
            <button type="submit" className={styles.addCarBtn}>
              update car
            </button>
            <button className={styles.addCarBtn} onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateCarPopup;
