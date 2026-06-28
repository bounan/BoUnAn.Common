import * as cdk from 'aws-cdk-lib';
import * as ssm from 'aws-cdk-lib/aws-ssm';

import type { ExportNames } from './export-names';

export const getCfnValue = <Config extends Record<string, string>>(
  key: keyof Config,
  prefix: string,
  exportSuffix: ExportNames,
  overrides: Config,
): string => {
  return overrides[key] || cdk.Fn.importValue(prefix + exportSuffix);
}

export const getSsmValue = <Config extends Record<string, string>>(
  stack: cdk.Stack,
  parameterPrefix: string,
  key: keyof Config & string,
  overrides: Config,
): string => {
  return overrides[key] || ssm.StringParameter.valueForStringParameter(stack, parameterPrefix + key);
}

export const cdkOut = (stack: cdk.Stack, key: string, value: object | string): void => {
  const output = typeof value === 'string' ? value : JSON.stringify(value);
  new cdk.CfnOutput(stack, key, { value: output });
}