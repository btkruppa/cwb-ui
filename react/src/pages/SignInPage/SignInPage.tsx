import { Authenticator } from "@aws-amplify/ui-react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function AuthRedirect() {
  const navigate = useNavigate();
  useEffect(() => {
    void navigate("/");
  }, [navigate]);
  return <></>;
}

export function SignInPage(props: { hidden: boolean }) {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.includes("sign-in")) {
      document.title = "Code With Blake Sign In";
    }
  }, [location]);
  return (
    <div
      style={{ display: props.hidden ? "none" : undefined, marginTop: "6rem" }}
    >
      <Authenticator signUpAttributes={["email"]}>
        {!props.hidden && <AuthRedirect></AuthRedirect>}
      </Authenticator>
    </div>
  );
}
