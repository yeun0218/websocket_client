import { useState } from "react";
import socket from "./socket";

function ReservationForm() {
    const [reservation, setReservation] = useState({ name: "", date: "", time: "" });

    const handleChange = (e) => {
        setReservation({ ...reservation, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit("makeReservation", reservation, (response) => {
            if (response.ok) {
                alert("Reservation made successfully!");
            } else {
                alert("Failed to make reservation: " + response.error);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Name" onChange={handleChange} />
            <input name="date" type="date" onChange={handleChange} />
            <input name="time" type="time" onChange={handleChange} />
            <button type="submit">Reserve</button>
        </form>
    );
}

export default ReservationForm;
