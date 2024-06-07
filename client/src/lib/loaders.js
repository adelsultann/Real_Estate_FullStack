import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

// Loader function for a single post page
export const singlePageLoader = async ({ request, params }) => {
  // Make an API request to fetch the single post based on the provided post ID
  const res = await apiRequest("/posts/" + params.id);
  console.log(res.data)
  // Return the data from the response
  return res.data;
};

// Loader function for a list of posts page
export const listPageLoader = async ({ request }) => {
  // Extract the query parameters from the request URL
  const query = request.url.split("?")[1] || ""; // If no query, it will be an empty string
  console.log(query);

  // Make an API request to fetch the list of posts based on the query parameters
  //makes the request with the query parameters if present, or simply /posts if no parameters are provided.
  const postPromise = apiRequest("/posts?" + query);

  // Return a deferred object that will resolve the API request promise
  return defer({
    postResponse: postPromise,
  });
};



// Loader function for the profile page
export const profilePageLoader = async () => {
  // Make an API request to fetch the posts for the user profile
  const postPromise = apiRequest("/users/profilePosts");
  // Make an API request to fetch the user's chats
  const chatPromise = apiRequest("/chats");

  // Return a deferred object that will resolve both API request promises
  return defer({
    postResponse: postPromise,
    chatResponse: chatPromise,
  });
};
