export type DeploymentStage = "local" | "beta" | "prod";

export interface StageConfiguration {
  amplify: {
    aws_cognito_region: "us-west-2"; // (required) - Region where Amazon Cognito project was created
    aws_user_pools_id: string; // (optional) -  Amazon Cognito User Pool ID
    aws_user_pools_web_client_id: string; // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
    aws_mandatory_sign_in?: "enable";
  };
  apiEndpoint: string,
}

const STAGE_CONFIGURATIONS: Record<DeploymentStage, StageConfiguration> = {
  local: {
    amplify: {
      aws_cognito_region: "us-west-2",
      aws_user_pools_id: "us-west-2_EKca11Ljm",
      aws_user_pools_web_client_id: "2h1c724e15mgqljb9furintcp7",
      aws_mandatory_sign_in: "enable",
    },
    apiEndpoint: 'todo'
  },
  beta: {
    amplify: {
      aws_cognito_region: "us-west-2",
      aws_user_pools_id: "us-west-2_EKca11Ljm",
      aws_user_pools_web_client_id: "2h1c724e15mgqljb9furintcp7",
      aws_mandatory_sign_in: "enable",
    },
    apiEndpoint: 'todo'
  },
  prod: {
    amplify: {
      aws_cognito_region: "us-west-2",
      aws_user_pools_id: "us-west-2_jCyva2o4a",
      aws_user_pools_web_client_id: "iaeaeqtkfff8npfqtj61i6irq",
      aws_mandatory_sign_in: "enable",
    },
    apiEndpoint: 'todo'
  },
};

export function getDeploymentStage(): DeploymentStage {
  if (
    window.location.host === "fullstackpros.com" ||
    window.location.host === "www.fullstackpros.com"
  ) {
    return 'prod';
  }
  if (
    window.location.host.startsWith("localhost") ||
    window.location.host.startsWith("192")
  ) {
    return 'local';
  }
  return 'beta';
}

export function getStageConfig() {
  const stage = getDeploymentStage();
  return STAGE_CONFIGURATIONS[stage];
}
