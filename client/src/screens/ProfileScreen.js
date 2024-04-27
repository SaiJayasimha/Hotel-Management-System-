import React, { useState, useEffect } from "react";
import { Tabs, Button, Input, Tag, message } from "antd";
import axios from "axios";

import MyBookingScreen from "./MyBookingScreen";
const { TabPane } = Tabs;

// Add your imports here

function ProfileScreen() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("currentUser")));
  const [editing, setEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });

  useEffect(() => {
    if (!user) {
      window.location.href = "/login";
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser({ ...updatedUser, [name]: value });
  };

  const updateUserDetails = async () => {
    try {
      const response = await axios.post("/api/updateUser", updatedUser);
      setUser(response.data);
      message.success("User details updated successfully");
      setEditing(false);
    } catch (error) {
      message.error("Failed to update user details");
      console.error("Error updating user details:", error);
    }
  };

  const callback = (key) => {
    console.log(key);
  };

  return (
    <div className="ml-3 mt-3">
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Profile" key="1">
          <div className="row">
            <div className="col-xs-12 ml-5 mb-5">
              <div className="bs">
                <p>My Profile</p>
                <p>
                  Name : {editing ? <Input name="name" value={updatedUser.name} onChange={handleInputChange} /> : user.name}
                </p>
                <p>
                  Email : {user.email}
                </p>
                <p>
                  IsAdmin :{" "}
                  {user.isAdmin ? <Tag color="green">YES</Tag> : <Tag color="red">NO</Tag>}
                </p>
                {editing ? (
                  <Button type="primary" onClick={updateUserDetails}>Update</Button>
                ) : (
                  <Button onClick={() => setEditing(true)}>Edit</Button>
                )}
              </div>
            </div>
          </div>
        </TabPane>
        <TabPane tab="Booking" key="2">
          <MyBookingScreen />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default ProfileScreen;
