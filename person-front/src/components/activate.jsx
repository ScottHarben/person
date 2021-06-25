import { useEffect } from "react";
import { useParams, Redirect } from "react-router-dom";

export default function Activate({ axios }) {
  let { email, guid } = useParams();
  useEffect(() => {
    (async function () {
      try {
        await axios.post("/activate", {
          GUID: guid,
        });
      } catch (error) {
        console.error(error); //log errors
      }
    })();
  }, []);
  return (
    <Redirect
      to={{ pathname: "/login", state: { userConfirmed: true, email: email } }}
    />
  );
}
