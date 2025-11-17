---
title: '100 Days of Cloud Security - Day 8: Defend - `lambda_privesc`'
date: '2025-11-17'
author: 'Venkata Pathuri'
excerpt: 'Day 8 of my cloud security journey - Defend - `lambda_privesc`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 8: Defend - `lambda_privesc`

## Overview
Welcome back to Day 8 of our cloud security journey! Today, we delve into the critical area of defending against privilege escalation vulnerabilities, specifically in AWS Lambda environments. Building on our previous discussions about identity and access management (IAM) from Day 7, we will explore how to implement the principle of least privilege effectively to secure your Lambda functions from potential exploitation.

## Learning Objectives
By the end of this lesson, you will master the art of securely implementing the `lambda_privesc` scenario. You will learn to identify overly permissive IAM policies and remediate them to prevent privilege escalation. You will also gain insights into crafting IAM policies that align with the principle of least privilege, ensuring that users and roles have only the permissions essential to perform their tasks.

## Deep Dive
In our analysis, we identified a significant vulnerability in the `cg-lambdaManager-policy-cgide3k5k2fwj7`, which allowed excessive permissions due to the inclusion of the `iam:PassRole` action with a wildcard resource (`"*"`). This configuration could enable an attacker to create a Lambda function with an elevated role, such as `AdministratorAccess`, leading to potentially catastrophic outcomes.

### Vulnerability Breakdown
The original policy was structured as follows:
```json
{
    "Statement": [
        {
            "Action": [
                "lambda:*",
                "iam:PassRole"
            ],
            "Effect": "Allow",
            "Resource": "*",
            "Sid": "lambdaManager"
        }
    ],
    "Version": "2012-10-17"
}
```
The glaring issue here is that it grants the ability to pass any IAM role, which is a common attack vector for privilege escalation in cloud environments.

### Remediation Steps
To correct this security flaw, we modified the policy to restrict the `iam:PassRole` action to a designated role, thereby adhering to the principle of least privilege:
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "LambdaActions",
            "Effect": "Allow",
            "Action": "lambda:*",
            "Resource": "*"
        },
        {
            "Sid": "RestrictPassRole",
            "Effect": "Allow",
            "Action": "iam:PassRole",
            "Resource": "arn:aws:iam::ACCOUNT_ID:role/SAFE_LAMBDA_EXECUTION_ROLE"
        }
    ]
}
```
This approach mitigates the risk of privilege escalation by ensuring that only the specified `SAFE_LAMBDA_EXECUTION_ROLE` can be passed, preventing any high-privilege roles from being assigned by users with the `lambdaManager` role.

### Visual Insights
As you work through this scenario, you'll see graphical representations of permissions and alerts indicating when a policy is too permissive. These visuals are crucial for understanding the implications of your IAM configurations.

### Current Best Practices
- **Restrict `iam:PassRole`**: Always limit the roles that can be passed to only those necessary for the Lambda function's operation.
- **Regularly Audit IAM Policies**: Conduct routine audits of IAM policies to ensure compliance with least privilege principles.
- **Use Role-based Access Control (RBAC)**: Implement RBAC to manage permissions more effectively and reduce complexity in IAM policies.

## Hands-On Practice
To apply what you've learned, follow these steps in your CloudGoat lab:

1. **Access the IAM Policy**: Navigate to the IAM section in the AWS Management Console and locate the `cg-lambdaManager-policy`.
2. **Modify the Policy**: Edit the policy to restrict the `iam:PassRole` action as demonstrated above.
3. **Test the Policy**: Attempt to create a Lambda function with an elevated role (e.g., one with `AdministratorAccess`). You should receive an error indicating insufficient permissions.
4. **Verify Changes**: Ensure that your changes are saved and that the policy displays the new restrictions.

### Troubleshooting Tips
- If you encounter issues applying the modified policy, double-check the ARN for the `SAFE_LAMBDA_EXECUTION_ROLE` for accuracy.
- Ensure that your IAM user has permission to modify policies; if not, consult your administrator.

## Key Takeaways
Today's lesson underscored the importance of implementing the principle of least privilege in cloud security. By identifying and remediating overly permissive IAM policies, we not only enhance security but also foster a culture of caution and responsibility in cloud resource management. As we progress, remember that vigilance and regular audits are your best defenses against privilege escalation attacks.

## Real-World Applications
In production environments, the lessons learned today are invaluable. Organizations often face the challenge of managing numerous IAM roles and policies. By adhering to the principles discussed, they can significantly reduce their attack surface and protect sensitive resources from unauthorized access. Moreover, implementing these best practices creates a robust security posture that can withstand the evolving threat landscape in cloud environments.

---

**Journey Progress:** 8/100 Days Complete 🚀