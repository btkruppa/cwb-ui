// import { Auth } from "aws-amplify";
import { type AuthUser, fetchAuthSession } from "aws-amplify/auth";
import {
  getDeploymentStage,
  getStageConfig,
} from "../config/deploymentStage";
import { Amplify, type ResourcesConfig } from "aws-amplify";
import { CookieStorage, Hub } from "aws-amplify/utils";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";

function getAmplifyConfiguration(): ResourcesConfig {
  const stageConfig = getStageConfig();
  const { aws_user_pools_id, aws_user_pools_web_client_id } =
    stageConfig.amplify;
  return {
    Auth: {
      Cognito: {
        userPoolClientId: aws_user_pools_web_client_id,
        userPoolId: aws_user_pools_id,
      },
    },
  };
}

Amplify.configure(getAmplifyConfiguration());
cognitoUserPoolsTokenProvider.setKeyValueStorage(
  new CookieStorage({
    domain:
      getDeploymentStage() === 'local'
        ? undefined
        : "codewithblake.com",
  }),
);

/**
 * Amplify does not automatically keep the cookies up to date. This causes issues for loading images and videos.
 * Therefore we have to create our own logic to keep the cookies updated.
 */

let interval: number;

async function updateInterval() {
  try {
    const { tokens } = await fetchAuthSession();
    const currentTimeMs = Math.round(+new Date());
    const expiration = tokens?.idToken?.payload.exp;
    if (!expiration) {
      return;
    }
    const expirationTimeMs = expiration * 1000;

    // 60 seconds before it expires
    const intervalTime = expirationTimeMs - currentTimeMs - 60000;
    if (interval) {
      clearInterval(interval);
    }
    interval = setTimeout(refreshIdToken, Math.max(intervalTime, 0));
  } catch (e) {
    console.log("auth failure", e);
    window.addEventListener(
      "focus",
      () => {
        // console.log("window re-focus", new Date());
        void refreshIdToken();
      },
      { once: true },
    );
  }
}

export async function refreshIdToken() {
  try {
    // causes token to refresh
    await fetchAuthSession({ forceRefresh: true });
    await updateInterval();
  } catch (e) {
    console.log("refresh error", e);

    window.addEventListener(
      "focus",
      () => {
        console.log("window re-focus", new Date());
        void refreshIdToken();
      },
      { once: true },
    );
  }
}

export function useCognitoDetails() {
  const authDetials = useAuthenticator((context) => [context.user]);
  const user = authDetials.user as AuthUser | undefined;

  const [subscription, setSubscription] = useState({
    isSubscribed: false,
    isLoading: true,
  });
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSubscription({
      isLoading: true,
      isSubscribed: false,
    });
    async function getUserGroups() {
      const { tokens } = await fetchAuthSession();
      const groups = tokens?.accessToken.payload["cognito:groups"] as
        | string[]
        | undefined;
      const email = tokens?.idToken?.payload.email as string | undefined;
      const isSubscribed =
        groups?.some((group) => group === "subscribers") ?? false;
      setSubscription({
        isLoading: false,
        isSubscribed,
      });
      setEmail(email ?? "");
    }
    void getUserGroups();
    const stopListen = Hub.listen("auth", (data) => {
      const { payload } = data;

      if (payload.event === "tokenRefresh") {
        void getUserGroups();
      }
    });
    return stopListen;
  }, [user]);

  return {
    user,
    isSubscribed: subscription.isSubscribed,
    isLoading: subscription.isLoading,
    email,
  };
}

/**
 * Trying to debug the auth issues.
 *
 * "NotAuthorizedException": Refresh Token has expired
 *
 * But all I have to do is a page refresh.
 *
 *
 */
Hub.listen("auth", (data) => {
  const { payload } = data;
  // console.log("auth event", payload);

  if (payload.event === "signedOut" && interval) {
    clearInterval(interval);
  }

  if (payload.event === "signedIn") {
    void updateInterval();
  }
});
