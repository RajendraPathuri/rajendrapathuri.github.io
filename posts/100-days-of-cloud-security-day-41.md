---
title: '100 Days of Cloud Security - Day 41: Hardening `glue_privesc`'
date: '2025-12-20'
author: 'Venkata Pathuri'
excerpt: 'Day 41 of my cloud security journey - Hardening `glue_privesc`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 41: Hardening `glue_privesc`

## Overview
Welcome back to our cloud security journey! In Day 40, we laid the groundwork for securing our AWS environment by implementing basic security best practices. Today, we take a significant step forward by focusing on hardening the `glue_privesc` scenario. This lesson is crucial as it addresses the protection of sensitive information stored in AWS Systems Manager (SSM) Parameter Store and ensures that our resources are safeguarded from unauthorized access.

## Learning Objectives
By the end of today’s session, you will master the techniques required to harden the `glue_privesc` environment. This includes restricting permissions on AWS Glue and SSM, enforcing security protocols on EC2 instances, and securing S3 buckets. You will also learn how to implement best practices for IAM roles and policies, ultimately enhancing the overall security posture of your cloud resources.

## Deep Dive
To effectively harden the `glue_privesc` scenario, we will dive into several key areas of AWS services and configurations. Each step is designed to minimize security vulnerabilities and align with industry best practices.

### IAM Policies
1. **Restricting Glue Management Policy**: 
   We updated the Glue management policy to focus specifically on the required resources. The use of a scoped ARN:
   ```hcl
   Resource = "arn:aws:glue:${var.region}:${data.aws_caller_identity.current.account_id}:this/*"
   ```
   This change significantly narrows the attack surface, ensuring that only designated Glue resources can be accessed. Additionally, we removed unnecessary permissions to eliminate potential privilege escalation paths.

2. **Hardening SSM Parameter Role**:
   By modifying the trust policy for the SSM parameter role, we allowed only SSM service principals to assume this role. This ensures that unauthorized entities cannot exploit this role for privilege escalation:
   ```hcl
   Principal = {
     Service = "ssm.amazonaws.com"
   }
   ```

### EC2 Instance Security
1. **Enforcing IMDSv2**:
   For the EC2 instance, we enabled Instance Metadata Service version 2 (IMDSv2) by setting:
   ```hcl
   http_tokens = "required"
   ```
   This configuration prevents metadata credential theft via Server-Side Request Forgery (SSRF) attacks, fortifying our instance against common threats.

2. **Removing Vulnerable User-Data Script**:
   We eliminated any user-data scripts that contained exploitable code such as SQL injection vectors or arbitrary file-upload logic. This proactive measure reduces the risk of attackers leveraging these scripts post-deployment.

### S3 Bucket Security
1. **Restricting S3 Write Permissions**:
   The S3 bucket policy was updated to limit PutObject access exclusively to the EC2 instance role. This ensures that only our application server can upload objects to the bucket, effectively blocking public or cross-service access:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Principal": {
           "AWS": "arn:aws:iam::${data.aws_caller_identity.current.account_id}:role/YourEC2InstanceRole"
         },
         "Action": "s3:PutObject",
         "Resource": "arn:aws:s3:::your-bucket-name/*"
       }
     ]
   }
   ```

### Securing SSM Parameter Store
1. **Using SecureString for Parameter Storage**:
   We configured sensitive information in the SSM Parameter Store to be stored as `SecureString`. This ensures that values are encrypted using AWS KMS:
   ```hcl
   parameter {
     name  = "/your/parameter/name"
     type  = "SecureString"
     value = "YourSensitiveValue"
   }
   ```

By implementing these measures, we significantly enhance the security of the `glue_privesc` environment, mitigating the risks associated with unauthorized access to sensitive resources.

## Hands-On Practice
To solidify your understanding, let’s implement these changes in your AWS environment:

1. **Update IAM Policy**: 
   Modify your Glue management policy to restrict access using the scoped ARN.

2. **Harden the SSM Role**:
   Adjust the trust policy of your SSM parameter role to only allow SSM service principals.

3. **EC2 Instance Security**:
   Enable IMDSv2 in your EC2 instance settings and remove any vulnerable user-data scripts.

4. **S3 Bucket Policy**:
   Restrict your S3 bucket write permissions by updating the bucket policy to allow only your EC2 instance role.

5. **Secure SSM Parameters**:
   Change your SSM parameter type to `SecureString` for any sensitive information.

**Expected Outcome**: After these changes, verify that the policies and configurations are correctly applied by checking the IAM roles, S3 bucket permissions, and SSM parameters in the AWS Management Console.

**Common Troubleshooting Tips**:
- If you encounter permission errors, double-check IAM roles and policies.
- Use the AWS Policy Simulator to validate the permissions before applying changes.
- Ensure that the EC2 instance has the correct IAM role attached and that it is running with the updated configuration.

## Key Takeaways
Today, we reinforced our understanding of securing AWS resources by implementing strict IAM policies, enforcing metadata service security, and securing sensitive data stored in SSM Parameter Store. Each of these measures contributes to a more robust security posture, protecting our cloud environment from potential threats.

## Real-World Applications
In real-world production environments, these practices are critical to maintaining data integrity and security. Companies handling sensitive customer information or financial data must ensure that their AWS configurations follow strict security protocols to prevent data breaches and comply with regulations. By adopting these practices, organizations can build a resilient cloud architecture that is less susceptible to threats.

---
**Journey Progress:** 41/100 Days Complete 🚀