---
title: '100 Days of Cloud Security - Day 49: Hardening — iam_privesc_by_ec2'
date: '2025-12-28'
author: 'Venkata Pathuri'
excerpt: 'Day 49 of my cloud security journey - Hardening — iam_privesc_by_ec2'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 49: Hardening — iam_privesc_by_ec2

## Overview
Welcome to Day 49 of our cloud security journey! Today, we delve deeper into hardening our AWS environment, focusing specifically on IAM privilege escalation via EC2. Building off the foundations laid in Day 48, where we explored IAM roles and policies, we'll tighten our security posture by implementing best practices that mitigate potential risks associated with IAM misconfigurations and Lambda vulnerabilities.

## Learning Objectives
By the end of this session, you will master the essential techniques for hardening your IAM configurations, specifically focusing on limiting role assumptions and minimizing permissions. You will also learn how to secure your Lambda functions against common vulnerabilities such as SQL injection and privilege escalation, ensuring that your cloud environment is robust and secure.

## Deep Dive
Let’s break down the actions we’ve taken to enhance our security posture:

### IAM Policy Enhancements
1. **Restricting Role Assumption**:
   In our `iam.tf` file, we've added a resource attribute to the `standard_user` policy, which restricts the `AssumeRole` action to a specific role ARN instead of using a wildcard pattern. This means that only designated users can assume roles that are vital for operations, reducing the attack surface. 

   ```hcl
   resource "aws_iam_policy" "standard_user" {
       name   = "standard_user"
       policy = jsonencode({
           Version = "2012-10-17"
           Statement = [
               {
                   Effect = "Allow"
                   Action = "sts:AssumeRole"
                   Resource = "arn:aws:iam::123456789012:role/specific-role" # Replace with your actual role ARN
               }
           ]
       })
   }
   ```

2. **Removing Excessive Permissions**:
   We removed IAM-related guest access permissions from both the `bilbo` user and the `lambda-invoker` role. This means actions like `iam:Get*`, `iam:List*`, and `iam:SimulateCustomPolicy` are no longer available, minimizing the chance for misuse.

3. **Cleaning Up IAM Policies**:
   The `cg_lambda_invoker` role's general policies were streamlined by removing unnecessary permissions such as `lambda:ListFunctions` and all IAM enumeration permissions. This not only simplifies the policy but also reduces the risks associated with overly broad permissions.

### Lambda Security Improvements
1. **Fixing SQL Injection Vulnerabilities**:
   In `lambda.tf`, we addressed a critical SQL injection vulnerability by implementing parameterized queries. This change ensures that user inputs are treated safely, preventing attackers from injecting malicious SQL code.

   ```python
   import pymysql

   def lambda_handler(event, context):
       connection = pymysql.connect(host='example.com',
                                    user='user',
                                    password='password',  # Replace with your actual credentials
                                    database='dbname')
       with connection.cursor() as cursor:
           sql = "SELECT * FROM users WHERE username = %s"
           cursor.execute(sql, (event['username'],))
           result = cursor.fetchall()
       return result
   ```

2. **Updating Python Runtime**:
   We updated the Lambda function's Python version from 3.9 to 3.13, which fixes underlying vulnerabilities found in older versions. Keeping runtimes updated is crucial for security.

3. **Revoking Attach User Policy Permission**:
   We’ve also removed the `iam:AttachUserPolicy` permission from the `policy_applier_lambda1` role to mitigate potential privilege escalation attacks. Limiting who can change user policies is a significant step in securing your IAM setup.

### Secrets Management
For `secretsmanager.tf`, while no immediate changes were required, we recommend using variables to manage sensitive data securely. This practice ensures that secrets are handled properly throughout your configurations.

## Hands-On Practice
To implement these changes, follow these steps:

1. **Modify IAM Policy**:
   Update your `iam.tf` file with the restricted role assumption policy.
   - **Expected Outcome**: The policy should now only allow specified roles to be assumed.

2. **Secure Lambda Function**:
   Ensure your Lambda function uses parameterized queries instead of concatenated strings. 
   - **Expected Outcome**: The function should execute SQL queries securely without risking injection vulnerabilities.

3. **Check Permissions**:
   Review the policies attached to your IAM roles and ensure all unnecessary permissions have been removed.
   - **How to Verify Success**: Use AWS IAM policy simulator to confirm the effective permissions.

### Common Troubleshooting Tips:
- If your Lambda function encounters errors after changes, check the CloudWatch logs for detailed error messages.
- For IAM permissions, ensure that the policies are correctly attached to the intended roles and users.

## Key Takeaways
Today’s hardening efforts are crucial in safeguarding your AWS environment against potential privilege escalation and vulnerabilities. By restricting IAM permissions and enhancing Lambda security, you're not just following best practices but also building a resilient cloud infrastructure capable of withstanding security threats.

## Real-World Applications
In production environments, implementing these hardening strategies is vital. For instance, organizations often face breaches due to misconfigured IAM policies or vulnerable Lambda functions. By minimizing permissions and securing code, you significantly reduce the risk of unauthorized access and data breaches, ensuring compliance with industry standards and regulations.

---
**Journey Progress:** 49/100 Days Complete 🚀