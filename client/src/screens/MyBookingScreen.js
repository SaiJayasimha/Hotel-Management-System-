import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Tag } from "antd";

import Loader from "../components/Loader";
import Error from "../components/Error";

function MyBookingScreen() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("currentUser"));

  async function fetchMyAPI() {
    setError("");
    setLoading(true);
    try {
      const { data } = await axios.post("/api/bookings/getbookingbyuserid", {
        userid: user._id,
      });
      setBookings(data);
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to fetch bookings");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchMyAPI();
  }, []);

  async function cancelBooking(bookingid, roomid) {
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/bookings/cancelbooking", { bookingid, roomid });
      setLoading(false);
      Swal.fire(
        "Congratulations",
        "Your Room Cancelled Successfully",
        "success"
      ).then(() => {
        fetchMyAPI();
      });
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to cancel booking");
      setLoading(false);
    }
  }

  async function removeQueue(roomid) {
    setError("");
    setLoading(true);
    try {
      await axios.post("/api/users/removeFromQueue", { userid: user._id, roomid });
      setLoading(false);
      Swal.fire(
        "Success",
        "Room removed from queue successfully",
        "success"
      ).then(() => {
        fetchMyAPI();
      });
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Failed to remove room from queue");
      setLoading(false);
    }
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error msg={error} />
      ) : (
        <div className="row">
          <div className="col-md-6 ml-5">
            {bookings.map((booking) => (
              <div className="bs" key={booking._id}>
                <h1>{booking.room}</h1>
                <p><b>BookingId:</b> {booking._id}</p>
                <p><b>CheckIn:</b> {booking.fromdate}</p>
                <p><b>CheckOut:</b> {booking.todate}</p>
                <p><b>Amount:</b> {booking.totalamount}</p>
                <p><b>Status:</b> {booking.status === "booked" ? (
                  <Tag color="green">CONFIRMED</Tag>
                ) : (
                  <Tag color="red">CANCELLED</Tag>
                )}</p>
                {booking.status === "booked" && (
                  <div className="text-right">
                    <button className="btn btn-danger" onClick={() => cancelBooking(booking._id, booking.roomid)}>
                      Cancel Booking
                    </button>
                  </div>
                )}
                {user.queue && user.queue.includes(booking.roomid) && (
                  <div className="text-right mt-2">
                    <button className="btn btn-warning" onClick={() => removeQueue(booking.roomid)}>
                      Remove from Queue
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookingScreen;
