export type DeploymentStage = "local" | "beta" | "prod";

export interface StageConfiguration {
  amplify: {
    aws_cognito_region: "us-east-1"; // (required) - Region where Amazon Cognito project was created
    aws_user_pools_id: string; // (optional) -  Amazon Cognito User Pool ID
    aws_user_pools_web_client_id: string; // (optional) - Amazon Cognito App Client ID (App client secret needs to be disabled)
    aws_mandatory_sign_in?: "enable";
  };
  apiEndpoint: string,
}

const STAGE_CONFIGURATIONS: Record<DeploymentStage, StageConfiguration> = {
  local: {
    amplify: {
      aws_cognito_region: "us-east-1",
      aws_user_pools_id: "us-east-1_QaChtvrcc",
      aws_user_pools_web_client_id: "npqahvu3n0hh6hveadc5iqprr",
      aws_mandatory_sign_in: "enable",
    },
    apiEndpoint: 'https://d2jq164330.execute-api.us-east-1.amazonaws.com/prod'
  },
  beta: {
    amplify: {
      aws_cognito_region: "us-east-1",
      aws_user_pools_id: "us-east-1_QaChtvrcc",
      aws_user_pools_web_client_id: "npqahvu3n0hh6hveadc5iqprr",
      aws_mandatory_sign_in: "enable",
    },
    apiEndpoint: 'https://d2jq164330.execute-api.us-east-1.amazonaws.com/prod'
  },
  prod: {
    amplify: {
      aws_cognito_region: "us-east-1",
      aws_user_pools_id: "",
      aws_user_pools_web_client_id: "",
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
