---
title: '100 Days of Cloud Security - Day 35: Hardening `secrets_in_the_cloud`'
date: '2025-12-14'
author: 'Venkata Pathuri'
excerpt: 'Day 35 of my cloud security journey - Hardening `secrets_in_the_cloud`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 35: Hardening `secrets_in_the_cloud`

## Overview
Welcome to Day 35 of our cloud security journey! Today, we delve into the critical topic of securing sensitive information in the cloud, specifically focusing on the `secrets_in_the_cloud` scenario. Building on the foundational security practices we explored in Day 34, we will implement robust measures to safeguard secrets stored in AWS, ensuring they are accessed securely and only by authorized entities. This is not just about compliance; it’s about creating a resilient infrastructure that protects your applications from potential vulnerabilities.

## Learning Objectives
By the end of this lesson, you will master how to harden your cloud environment by effectively managing secrets. You will learn to configure IAM policies for least privilege access, implement best practices for handling sensitive data in Lambda functions, and secure EC2 instances against credential leaks. This knowledge will empower you to enhance your cloud security posture significantly.

## Deep Dive
### 1. IAM Configuration
**Policy Adjustments:** One of the first steps in hardening our AWS secrets management is refining IAM policies. In our scenario, we identified that the policy for accessing the AWS Secrets Manager was overly permissive, granting wildcard access. We replaced:

```hcl
  Resource = "*"
```
with:
```hcl
  Resource = aws_secretsmanager_secret.this.arn
```
This ensures that the IAM user can only access the specific secret created for this scenario, significantly reducing the risk of unauthorized access.

### 2. Lambda Function Security
**Environment Variables Management:** Hardcoding sensitive information such as API keys directly into the Lambda environment variables is a common pitfall. Instead of this practice, we recommend storing sensitive credentials in AWS Secrets Manager. For instance, instead of:

```hcl
  environment {
    variables = {
      API_KEY = "DavidsDelightfulDonuts2023"
    }
  }
```
Remove the entire block and retrieve the API key at runtime securely. This approach minimizes exposure and aligns with best practices in credential management.

### 3. EC2 Instance Hardening
**User Data Security:** Passing IAM credentials in plaintext within EC2 user data exposes your environment to serious risks. Instead, utilize an IAM instance profile:

```hcl
  iam_instance_profile = aws_iam_instance_profile.my_instance_profile.name
```
This allows your EC2 instance to access AWS services securely without hardcoding credentials.

**Security Group Configuration:** Exposing SSH (port 22) to public IP addresses is another risky practice. We removed the SSH ingress rule and recommend using AWS Systems Manager Session Manager for secure access. This not only protects your instance but also keeps your management processes streamlined and secure.

**Metadata Service Hardening:** We implemented key changes to the EC2 instance metadata options to prevent enumeration attacks:

```hcl
  metadata_options {
    http_tokens                 = "required"   # Enforces IMDSv2
    http_put_response_hop_limit = 1            # Prevents access from containers
    instance_metadata_tags      = "disabled"   # Disables tag enumeration
  }
```
These modifications ensure that only authorized requests can interact with the instance metadata, providing a robust layer of security.

### 4. DynamoDB Table Review
**Credential Storage:** Storing IAM credentials in DynamoDB is a serious security flaw. We removed any such entries to eliminate the risk of credential exposure. Always prefer using instance profiles or Secrets Manager for sensitive information.

### 5. Secrets Manager Policy Enhancement
**Restricting Access:** Finally, we modified the secret access policy to prevent public access. The previous configuration allowed anyone access:

```hcl
  Principal = "*"
```
This was changed to restrict access only to specific IAM roles or users, safeguarding your secrets against unauthorized access.

## Hands-On Practice
To implement these security measures, follow these steps:

1. **Update IAM Policies**: Modify your `iam.tf` file to restrict resource access as discussed.
2. **Refactor Lambda Function**: Remove hardcoded API keys from your Lambda configuration and implement Secrets Manager retrieval.
3. **Secure EC2 User Data**: Ensure that your EC2 instances utilize IAM roles instead of hardcoded credentials.
4. **Modify Security Groups**: Remove SSH access rules and consider using Systems Manager for instance access.
5. **DynamoDB Cleanup**: Ensure no sensitive credentials are stored in your DynamoDB tables.
6. **Refine Secrets Manager Policies**: Update your secret policies to restrict access appropriately.

### Expected Outcomes
After implementing these changes, you should see a dramatic improvement in the security posture of your AWS environment, with sensitive information securely managed and access strictly controlled.

### Common Troubleshooting Tips
- If you encounter permission errors, double-check your IAM policies and roles.
- Ensure that your Lambda function is correctly configured to retrieve secrets from AWS Secrets Manager.

## Key Takeaways
Today’s lesson emphasized the importance of protecting sensitive information within your cloud environment. By refining IAM policies, securely managing credentials, and hardening your EC2 instances, you significantly reduce the risk of unauthorized access. Remember, security is not a one-time task but an ongoing effort that requires vigilance and best practices.

## Real-World Applications
In production environments, implementing these security measures can prevent data breaches and protect sensitive information from being exposed. Organizations across various industries, from finance to healthcare, are increasingly adopting these practices to comply with regulations and safeguard their assets. As you advance in your cloud security journey, these skills will be invaluable in ensuring robust cloud security frameworks.

---
**Journey Progress:** 35/100 Days Complete 🚀