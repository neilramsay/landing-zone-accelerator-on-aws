/**
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

import { describe, beforeEach, expect, test } from '@jest/globals';
import { manageEbsDefaultEncryption } from '../../executors/accelerator-amazon-ec2';
import { ManageEbsDefaultEncryptionModule } from '../../lib/amazon-ec2/manage-ebs-default-encryption/index';
import { MOCK_CONSTANTS } from '../mocked-resources';
import { IManageEbsDefaultEncryptionHandlerParameter } from '../../interfaces/amazon-ec2/manage-ebs-default-encryption';

// Mock dependencies
jest.mock('../../lib/amazon-ec2/manage-ebs-default-encryption/index');

describe('AmazonEc2Executor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('manageEbsDefaultEncryption', () => {
    const input: IManageEbsDefaultEncryptionHandlerParameter = {
      ...MOCK_CONSTANTS.runnerParameters,
      configuration: MOCK_CONSTANTS.ManageEbsDefaultEncryptionModule.configuration,
    };
    test('should successfully configure default encryption key', async () => {
      // Setup
      const mockHandler = jest.fn().mockResolvedValue('SUCCESS');

      (ManageEbsDefaultEncryptionModule as unknown as jest.Mock).mockImplementation(() => ({
        handler: mockHandler,
      }));

      // Execute
      const result = await manageEbsDefaultEncryption(input);

      // Verify
      expect(result).toBe('SUCCESS');
      expect(mockHandler).toHaveBeenCalledWith(input);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });

    test('should throw error when fails', async () => {
      // Setup

      const errorMessage = 'Operation failed';
      const mockHandler = jest.fn().mockRejectedValue(new Error(errorMessage));

      (ManageEbsDefaultEncryptionModule as unknown as jest.Mock).mockImplementation(() => ({
        handler: mockHandler,
      }));

      // Execute && Verify
      await expect(manageEbsDefaultEncryption(input)).rejects.toThrow(errorMessage);

      expect(mockHandler).toHaveBeenCalledWith(input);
      expect(mockHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('Uncaught Exception Handler', () => {
    let originalProcessOn: typeof process.on;
    let processOnCallback: NodeJS.UncaughtExceptionListener;

    beforeEach(() => {
      originalProcessOn = process.on;

      process.on = jest.fn((event: string, listener: NodeJS.UncaughtExceptionListener) => {
        if (event === 'uncaughtException') {
          processOnCallback = listener;
        }
        return process;
      }) as unknown as typeof process.on;

      jest.resetModules();
    });

    afterEach(() => {
      process.on = originalProcessOn;
    });

    test('should register uncaughtException handler', () => {
      require('../../executors/accelerator-amazon-ec2');

      expect(process.on).toHaveBeenCalledWith('uncaughtException', expect.any(Function));
    });

    test('should rethrow the error when uncaughtException occurs', () => {
      require('../../executors/accelerator-amazon-ec2');

      const testError = new Error('Test uncaught exception');
      const origin = 'uncaughtException';

      expect(processOnCallback).toBeDefined();

      expect(() => {
        processOnCallback(testError, origin);
      }).toThrow(testError);
    });
  });
});
