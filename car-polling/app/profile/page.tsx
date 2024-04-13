"use client";
import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import "./myprofile.css";

interface User {
  _id: string;
  email: string;
  image: string;
}

const Profile = () => {
  const [user, setUser] = useState<User>({
    _id: "",
    email: "",
    image: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [passwordData, setPasswordData] = useState({
    oldpassword: "",
    newpassword: "",
    confirmnewpassword: "",
  });
  const [newEmail, setNewEmail] = useState<string>(user.email);

  useEffect(() => {
    async function getUser() {
      try {
        const res = await fetch("http://localhost:8000/auth/getUser", {
          credentials: "include",
        });
        const data: User = await res.json();
        setUser(data);
        setNewEmail(data.email);
      } catch (error) {
        console.log(error);
      }
    }
    getUser();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formdata = new FormData();
    try {
      if (image) {
        const filename = Date.now() + image.name;
        formdata.append("name", filename);
        formdata.append("file", image);
      }
      const response = await fetch("http://localhost:8000/auth/upload", {
        method: "POST",
        credentials: "include",
        body: formdata,
      });
      const data = await response.json();
      console.log(data);
      user.image = data.filename;
    } catch (error) {
      console.log(error);
    }
    console.log(user);

    try {
      const response = await fetch(
        `http://localhost:8000/auth/updateUser/${user._id}`,
        {
          method: "PATCH",
          credentials: "include",
          body: JSON.stringify(user),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0] || null;
      setImage(file);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEmailValue = e.target.value;
    setNewEmail(newEmailValue);
  };

  return (
    <>
      <div className="main_container">
        <div className="profile-heading">Profile Update</div>
        <div>
          <div className="photo_upload_section">
            <div className="image-container">
              <input
                onChange={handleImageChange}
                id="file-upload"
                type="file"
                name=""
              />
              <div className="w-full h-full p-2 items-center">
                {image ? (
                  <img
                    className="rounded-full"
                    src={`http://localhost:8000/uploads/${user.image}`}
                    alt=""
                  />
                ) : (
                  <>
                    {image && (
                      <img
                        className="rounded-full"
                        src={URL.createObjectURL(image)}
                        alt="Profile"
                      />
                    )}
                  </>
                )}
              </div>
              <label htmlFor="file-upload" className="upload-btn">
                Upload Photo
              </label>
            </div>
          </div>
          <div className="profile-details-section">
            <form>
              <p>Old Password</p>
              <input
                type="text"
                value={passwordData.oldpassword}
                onChange={(e) => {
                  setPasswordData({
                    ...passwordData,
                    oldpassword: e.target.value,
                  });
                }}
              />
            </form>

            <form>
              <p>New Password:</p>
              <input
                type="text"
                value={passwordData.newpassword}
                onChange={(e) => {
                  setPasswordData({
                    ...passwordData,
                    newpassword: e.target.value,
                  });
                }}
              />
            </form>
            <form>
              <p>Confirm Password</p>
              <input
                type="text"
                value={passwordData.confirmnewpassword}
                onChange={(e) => {
                  setPasswordData({
                    ...passwordData,
                    confirmnewpassword: e.target.value,
                  });
                }}
              />
            </form>
            <form>
              <p>Email Id</p>
              <input
                type="text"
                value={newEmail}
                onChange={handleEmailChange}
              />
            </form>
            <button onClick={handleSubmit} className="save-profile-btn">
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
