import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button } from "antd";

import Loader from "../components/Loader";
import Error from "../components/Error";

function AdminRoomScreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRooms = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.get("/api/rooms/getallrooms");
      setRooms(data);
    } catch (error) {
      console.log(error);
      setError("Error fetching rooms");
    }
    setLoading(false);
  };

  const handleDelete = async (roomId) => {
    try {
      await axios.delete(`/api/rooms/delete/${roomId}`);
      fetchRooms(); // Fetch rooms again after deletion
    } catch (error) {
      console.log(error);
      setError("Error deleting room");
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const columns = [
    {
      title: "Room ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Max Count",
      dataIndex: "maxcount",
      key: "maxcount",
    },
    {
      title: "Phone Number",
      dataIndex: "phonenumber",
      key: "phonenumber",
    },
    {
      title: "Rent Per Day",
      dataIndex: "rentperday",
      key: "rentperday",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button danger onClick={() => handleDelete(record._id)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div className="row">
      {loading ? (
        <Loader />
      ) : error ? (
        <Error msg={error} />
      ) : (
        <>
          <div className="col md-12">
            <Button className="btn btn-success" onClick={fetchRooms}>
              Refresh
            </Button>
          </div>
          <div className="col-md-12">
            <Table columns={columns} dataSource={rooms} />
          </div>
        </>
      )}
    </div>
  );
}

export default AdminRoomScreen;
