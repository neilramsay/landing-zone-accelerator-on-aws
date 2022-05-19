/**
 *  Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance
 *  with the License. A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the 'license' file accompanying this file. This file is distributed on an 'AS IS' BASIS, WITHOUT WARRANTIES
 *  OR CONDITIONS OF ANY KIND, express or implied. See the License for the specific language governing permissions
 *  and limitations under the License.
 */

import { Stack } from 'aws-cdk-lib';
import * as CdkExtensions from '../index';

/**
 * Stack Initialization
 */
export const stack = new Stack();
/**
 * Accelerator Pipeline Secure Bucket Properties
 */
export const repositoryProps: CdkExtensions.RepositoryProps = {
  repositoryName: 'AWS-accelerator',
  repositoryBranchName: 'main',
  s3BucketName: 'Testbucket',
  s3key: 'testkey',
};
