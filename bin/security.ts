#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { SecurityStack } from '../lib/security-stack';

const app = new cdk.App();
new SecurityStack(app, 'SecurityStack');
