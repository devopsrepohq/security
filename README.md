Use this CDK stack to create a security group for bastion host.

![Security architecture](https://images.prismic.io/devopsrepo/a5c46d9c-e88e-4e3e-af04-45d70171cc1c_security.png?auto=compress,format)

## What is it?

- A security group acts as a virtual firewall for your instance to control inbound and outbound traffic.
- A network access control list (ACL) is an optional layer of security for your VPC that acts as a firewall for controlling traffic in and out of one or more subnets.
- [Comparison of security groups and network ACLs](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Security.html#VPC_Security_Comparison)

## Features

- [x] Deploy a security group for bastion host.
- [x] Add inbound rules for ssh access.

## Prerequisites

You will need the following before utilize this CDK stack:

- [AWS CLI](https://cdkworkshop.com/15-prerequisites/100-awscli.html)
- [AWS Account and User](https://cdkworkshop.com/15-prerequisites/200-account.html)
- [Node.js](https://cdkworkshop.com/15-prerequisites/300-nodejs.html)
- [IDE for your programming language](https://cdkworkshop.com/15-prerequisites/400-ide.html)
- [AWS CDK Tookit](https://cdkworkshop.com/15-prerequisites/500-toolkit.html)
- [AWS Toolkit VSCode Extension](https://github.com/devopsrepohq/aws-toolkit)

## Stack Explain

### cdk.json

Define project-name and env context variables in cdk.json

```json
{
  "context": {
    "project-name": "container",
    "env": "dev",
    "profile": "devopsrepo"
  }
}
```

### lib/vpc-stack.ts

Setup standard VPC with public, private, and isolated subnets.

```javascript
const vpc = new ec2.Vpc(this, 'Vpc', {
  maxAzs: 3,
  natGateways: 1,
  cidr: '10.0.0.0/16',
  subnetConfiguration: [
    {
      cidrMask: 24,
      name: 'ingress',
      subnetType: ec2.SubnetType.PUBLIC,
    },
    {
      cidrMask: 24,
      name: 'application',
      subnetType: ec2.SubnetType.PRIVATE,
    },
    {
      cidrMask: 28,
      name: 'rds',
      subnetType: ec2.SubnetType.ISOLATED,
    }
  ]
});
```

- maxAzs - Define 3 AZs to use in this region.
- natGateways - Create only 1 NAT Gateways/Instances.
- cidr - Use '10.0.0.0/16' CIDR range for the VPC.
- subnetConfiguration - Build the public, private, and isolated subnet for each AZ.

Create flowlog and log the vpc traffic into cloudwatch

```javascript
vpc.addFlowLog('FlowLog');
```

### lib/security-stack.ts

Get vpc create from vpc stack

```javascript
const { vpc } = props;
```

Create security group for bastion host

```javascript
const bastionSecurityGroup = new ec2.SecurityGroup(this, 'BastionSecurityGroup', {
  vpc: vpc,
  allowAllOutbound: true,
  description: 'Security group for bastion host',
  securityGroupName: 'BastionSecurityGroup'
});
```

- vpc - Use vpc created from vpc stack.
- allowAllOutbound - Allow outbound rules for access internet
- description - Description for security group
- securityGroupName - Define the security group name

Allow ssh access to bastion host

```javascript
bastionSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'SSH access');
```

Deploy all the stacks to your aws account.

```bash
cdk deploy '*'
or
cdk deploy '*' --profile your_profile_name
```

## Use cases

Act as a firewall to block all inbound traffic and allow the only necessary port to access the instances.

## Useful commands

### NPM commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests

### Toolkit commands

 * `cdk list (ls)`            Lists the stacks in the app
 * `cdk synthesize (synth)`   Synthesizes and prints the CloudFormation template for the specified stack(s)
 * `cdk bootstrap`            Deploys the CDK Toolkit stack, required to deploy stacks containing assets
 * `cdk deploy`               Deploys the specified stack(s)
 * `cdk deploy '*'`           Deploys all stacks at once
 * `cdk destroy`              Destroys the specified stack(s)
 * `cdk destroy '*'`          Destroys all stacks at once
 * `cdk diff`                 Compares the specified stack with the deployed stack or a local CloudFormation template
 * `cdk metadata`             Displays metadata about the specified stack
 * `cdk init`                 Creates a new CDK project in the current directory from a specified template
 * `cdk context`              Manages cached context values
 * `cdk docs (doc)`           Opens the CDK API reference in your browser
 * `cdk doctor`               Checks your CDK project for potential problems