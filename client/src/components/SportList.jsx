import { useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, CircularProgress } from "@mui/material";

const SportList = () => {
  const [sports, setSports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:5000/api/sports")
      .then(res => {
        setSports(res.data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) return <CircularProgress />;

  return (
    <List>
      {sports.map((sport) => (
        <ListItem key={sport.id}>
          <ListItemText primary={sport.sport_name} secondary={`Category: ${sport.category_name}`} />
        </ListItem>
      ))}
    </List>
  );
};

export default SportList;
