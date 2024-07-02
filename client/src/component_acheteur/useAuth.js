import { useEffect, useState } from "react";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");

    if (storedToken) {
      setToken(storedToken);
      setUsername(storedUsername);
    }
  }, []);

  return { token, username };
};
