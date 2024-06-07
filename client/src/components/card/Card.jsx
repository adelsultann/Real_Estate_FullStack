import { Link } from "react-router-dom";
import "./card.scss";
import apiRequest from "../../lib/apiRequest";
import { useState, useEffect } from "react";

function Card({ item }) {
  console.log(item)

  //Initializes the state to store the username.
  const [username, setUsername] = useState("");

  // Function to fetch the username based on the userId
  const getUsername = async (userId) => {
    try {
      const response = await apiRequest.get(`/users/${userId}`);
      return response.data.username;
    } catch (err) {
      console.log(err);
      return "Unknown";
    }
  };

    // Use useEffect to fetch the username when the component mounts or userId changes
    useEffect(() => {
      const fetchUsername = async () => {
        const name = await getUsername(item.userId);
        setUsername(name);
      };
      fetchUsername();
    }, [item.userId]);
  
  return (
    <div className="card">
      <Link to={`/${item.id}`} className="imageContainer">
        <img src={item.images[0]} alt="" />
      </Link>
      <div className="textContainer">
        <h2 className="title">
          <Link to={`/${item.id}`}>{item.title}</Link>
        </h2>
        <p className="address">
          <img src="/pin.png" alt="" />
          <span>{item.address}</span>
        </p>
        <p className="price">$ {item.price}</p>
        <p className="name">{username}</p>
        <div className="bottom">
          <div className="features">
            <div className="feature">
              <img src="/bed.png" alt="" />
              <span>{item.bedroom} bedroom</span>
            </div>
            <div className="feature">
              <img src="/bath.png" alt="" />
              <span>{item.bathroom} bathroom</span>
            </div>
          </div>
          <div className="icons">
            <div className="icon">
              <img src="/save.png" alt="" />
            </div>
            <div className="icon">
              <img src="/chat.png" alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;
