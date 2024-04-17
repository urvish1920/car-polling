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

interface AddCarPopupProps {
  onClose: () => void;
  onAddCar: (carData: CarData) => void;
}

const AddCarPopup: React.FC<AddCarPopupProps> = ({ onClose, onAddCar }) => {
  const [carData, setCarData] = useState<CarData>({
    name: "",
    model: "",
    color: "",
    No_Plate: "",
    seaters: 0,
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
    onAddCar(carData);
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <h2>Add New Car</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Car Name"
            name="name"
            type="text"
            value={carData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Model"
            name="model"
            type="text"
            value={carData.model}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Color"
            name="color"
            type="text"
            value={carData.color}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Plate Number"
            name="No_Plate"
            type="text"
            value={carData.No_Plate}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Seaters"
            name="seaters"
            type="number"
            value={carData.seaters}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <div className={styles.buttons}>
            <button type="submit" className={styles.addCarBtn}>
              Add Car
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

export default AddCarPopup;
