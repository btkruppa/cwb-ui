// import { Auth } from "aws-amplify";
import { fetchAuthSession } from "aws-amplify/auth";
import {
  getDeploymentStage,
  getStageConfig,
} from "../config/deploymentStage";
import { Amplify, type ResourcesConfig } from "aws-amplify";
import { CookieStorage, Hub } from "aws-amplify/utils";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";

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
