import React, { useEffect } from "react";
import { Tabs } from "antd";
import AdminBookingScreen from "./AdminBookingScreen";
import AdminRoomScreen from "./AdminRoomScreen";
import AdminUserScreen from "./AdminUserScreen";
import AdminAddRoomScreen from "./AdminAddRoomScreen";

const { TabPane } = Tabs;

function AdminScreen() {
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user || !user.isAdmin) {
      // Redirect to home if user is not logged in or not admin
      window.location.href = "/home";
    }
  }, []);

  return (
    <div className="ml-3 mt-3 mr-3 bs">
      <h1 className="text-center">Admin Panel</h1>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Bookings" key="1">
          <AdminBookingScreen />
        </TabPane>
        <TabPane tab="Rooms" key="2">
          <AdminRoomScreen />
        </TabPane>
        <TabPane tab="Add Room" key="3">
          <AdminAddRoomScreen />
        </TabPane>
        <TabPane tab="Users" key="4">
          <AdminUserScreen />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default AdminScreen;
