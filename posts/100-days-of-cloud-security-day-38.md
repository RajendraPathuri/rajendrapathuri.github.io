---
title: '100 Days of Cloud Security - Day 38: Hardening `rce_web_app`'
date: '2025-12-17'
author: 'Venkata Pathuri'
excerpt: 'Day 38 of my cloud security journey - Hardening `rce_web_app`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 38: Hardening `rce_web_app`

## Overview
Welcome to Day 38 of our cloud security journey! Today, we take a significant step forward by hardening the `rce_web_app` scenario to safeguard sensitive information and tighten security controls. Building upon our previous discussions on managing IAM roles and policies, we will focus on effective practices to secure our application environment against common vulnerabilities, particularly those that could lead to Remote Code Execution (RCE) attacks.

## Learning Objectives
In today's lesson, you will master several critical security measures to protect your application environment. You will learn how to eliminate insecure storage practices for sensitive credentials, enhance network security for your resources, and enforce stricter IAM policies. By the end of the day, you'll have a structured approach to hardening your cloud applications, ensuring they are resilient against potential exploits.

## Deep Dive
The `rce_web_app` scenario presents a compelling case for understanding the nuances of cloud security. The initial setup included a VPC with various resources such as an Elastic Load Balancer (ELB), EC2 instance, S3 buckets, and an RDS database. However, the discovery of sensitive credentials stored in S3 and the potential for RCE due to insecure application logging exposed critical vulnerabilities.

### Identifying Vulnerabilities
The first step in hardening `rce_web_app` was to identify and mitigate the risk associated with storing sensitive secrets in S3. This included:
- **Removing S3 Buckets**: We deleted the Secrets and Keystore S3 buckets, ensuring that no sensitive information, like database credentials or SSH keys, was stored insecurely. S3 should never be a repository for secrets. Instead, use AWS Secrets Manager or AWS Systems Manager Parameter Store, which encrypts data at rest and provides fine-grained access controls.

### Database Security
Next, we focused on securing the RDS instance:
- **Egress Traffic Restrictions**: We restricted RDS egress traffic to only the VPC or approved whitelisted IPs, thus preventing unauthorized access.
- **Public Accessibility**: Ensured that the database was not publicly accessible, thereby reducing the attack surface.
- **Inbound Rules**: Configured the security group to allow connections only from the EC2 instance on port 5432.

### EC2 Instance Hardening
For the EC2 instance, we implemented several best practices:
- **IMDSv2 Activation**: We enabled Instance Metadata Service Version 2 (IMDSv2) and required the use of session tokens, adding an extra layer of security against metadata exposure.
- **Role Permissions Review**: Removed unnecessary permissions like `AmazonS3FullAccess`, limiting the EC2 role to the specific resources it needs.
- **Eliminating User Data Scripts**: We removed any user data scripts that could expose secrets or allow for malicious callbacks, ensuring that sensitive commands were not executed during instance startup.

### IAM Policy Refinements
Lastly, we refined IAM user permissions:
- **Resource-Scoped Policies**: Implemented resource-scoped policies to restrict users to only their specific S3 buckets and removed broad permissions like `s3:ListAllMyBuckets`.
- **Access Key Management**: Enforced access key rotation every 30 days to further mitigate the risk of credential compromise.

## Hands-On Practice
To solidify your learning, here’s a practical exercise:

1. **Delete S3 Buckets**:
   ```bash
   aws s3 rb s3://your-secrets-bucket --force
   aws s3 rb s3://your-keystore-bucket --force
   ```

2. **Configure RDS Security Group**:
   Ensure that your RDS instance's security group only accepts connections from your EC2 instance:
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Action": "rds:Connect",
               "Resource": "arn:aws:rds:us-east-1:123456789012:db:your-database",
               "Condition": {
                   "IpAddress": {
                       "aws:SourceIp": "VPC_CIDR_BLOCK"
                   }
               }
           }
       ]
   }
   ```

3. **Enable IMDSv2**:
   You can enable IMDSv2 by modifying your EC2 instance's metadata options:
   ```bash
   aws ec2 modify-instance-metadata-options --instance-id i-1234567890abcdef0 --http-tokens required
   ```

4. **Verify Changes**:
   Ensure that no sensitive information is accessible via the S3 buckets or through user-data scripts.

### Common Troubleshooting Tips:
- If you encounter issues with your IAM policies, check the AWS IAM Policy Simulator to validate permissions.
- Use AWS CloudTrail to monitor and audit API calls made to your resources, ensuring compliance with your security measures.

## Key Takeaways
Today’s lesson emphasized the importance of securely handling sensitive credentials and implementing robust security practices across your cloud architecture. By removing insecure storage, refining IAM roles, and enhancing your network security posture, you significantly reduce the risk of exploitation. Remember, security is an ongoing process, and continuous assessment is vital.

## Real-World Applications
In actual production environments, adhering to these hardening practices can prevent data breaches and unauthorized access. Companies that have implemented strict security measures, such as using AWS Secrets Manager for credential storage and regularly auditing IAM policies, have reported a marked decrease in security incidents. By following best practices, you can ensure that your applications remain secure and resilient against evolving threats.

---
**Journey Progress:** 38/100 Days Complete 🚀