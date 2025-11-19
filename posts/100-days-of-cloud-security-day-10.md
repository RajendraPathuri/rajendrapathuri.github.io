---
title: '100 Days of Cloud Security - Day 10: Defend Reports for Day 7 - `lambda_privesc`'
date: '2025-11-19'
author: 'Venkata Pathuri'
excerpt: 'Day 10 of my cloud security journey - Defend Reports for Day 7 - `lambda_privesc`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 10: Defend Reports for Day 7 - `lambda_privesc`

## Overview
Welcome back to our 100-day cloud security journey! Today, we will delve deeper into defending against potential privilege escalation vulnerabilities, particularly focusing on the `lambda_privesc` scenario we encountered on Day 7. Building on our previous discussions around AWS IAM policies and roles, we'll explore critical security practices that will help you safeguard your cloud environment.

## Learning Objectives
By the end of today’s lesson, you will master the principles of cross-service confused deputy prevention and understand the importance of crafting precise IAM policies to avoid overly permissive role assumptions. You will learn practical strategies to mitigate risks associated with `iam:PassRole` and `sts:AssumeRole`, ensuring a more secure AWS environment.

## Deep Dive

### Cross-Service Confused Deputy Prevention
The concept of confused deputy arises when one AWS service inadvertently uses another service’s permissions, leading to unauthorized actions. For instance, imagine a Lambda function that has permissions to access an S3 bucket. If this Lambda function is exploited, an attacker could potentially manipulate it to perform actions on behalf of the S3 service that it shouldn't be allowed to execute.

To mitigate this, you can implement the `AWS:SourceArn` and `AWS:SourceAccount` condition keys in your IAM policies. These keys act as additional verification layers, ensuring that only trusted sources are allowed to invoke specific actions. For example, you could restrict access to an S3 bucket by specifying the ARN of the Lambda function that should interact with it, thus preventing any unauthorized service from making calls to the bucket.

![Cross-Service Confused Deputy Prevention](../img/day10-1.png)

### No Custom Policy Permissive Role Assumption
Next, let’s address the risk of overly permissive role assumptions. If your IAM policies allow the use of wildcards in `sts:AssumeRole`, an attacker could escalate their privileges and gain access to sensitive resources. For instance, a poorly configured policy could allow any user to assume roles that should be strictly controlled.

To prevent this, always specify exact Role ARNs in your policies instead of using wildcards. Additionally, enforce resource-based restrictions to limit which entities can assume roles and under what conditions. This practice not only enhances security but also promotes a principle of least privilege.

![IAM Policy Example](../img/day10-2.png)
![Role Assumption Example](../img/day10-3.png)

### `iam:PassRole` as a Critical Privilege Escalation Vector
One of the most critical permissions to monitor is `iam:PassRole`. This permission allows a user to pass a role to an AWS service, which can inadvertently grant that service elevated privileges. For example, if a user with `iam:PassRole` permission passes a role that has broader access than intended, it can lead to serious security vulnerabilities.

To protect against this, you should implement stringent policies that restrict which roles can be passed and by whom. For instance, if you have a user who can create EC2 instances, ensure they can only pass roles that are specifically designed for their use case, preventing them from gaining access to sensitive data or services inadvertently.

![iam:PassRole Visual](../img/day10-4.png)

## Hands-On Practice
To put these concepts into action, try the following:

1. **Create an IAM Policy**: Write an IAM policy that includes conditions using `AWS:SourceArn` and `AWS:SourceAccount`.
   - Use the AWS Management Console or AWS CLI to create the policy.
   - Ensure that you specify exact Role ARNs without wildcards.

2. **Test `iam:PassRole` Restrictions**:
   - Create two roles: one with limited permissions and another with broader permissions.
   - Assign the `iam:PassRole` permission to a user and attempt to pass both roles to an EC2 instance. Observe the behavior based on your policy definitions.

3. **Verify Success**: 
   - Check CloudTrail logs to see if the role assumptions were executed as intended.
   - Ensure that only the permitted role was passed and unauthorized actions were logged.

### Common Troubleshooting Tips
- If policies are not behaving as expected, double-check the syntax and ensure that the conditions are correctly implemented.
- Use the AWS Policy Simulator to test your IAM policies before applying them in a production environment.

## Key Takeaways
Today, we explored the importance of securing your AWS environment against privilege escalation through careful IAM policy design. By implementing specific conditions and avoiding wildcards in role assumptions, you can significantly reduce the risk of unauthorized access. We also highlighted the critical nature of `iam:PassRole` and how it can be a double-edged sword if not managed correctly.

## Real-World Applications
These concepts are not just theoretical; they have real-world implications for organizations leveraging AWS. For instance, a financial services company recently faced a security breach due to a misconfigured IAM policy allowing excessive permissions. By applying the learning from today, they could have restricted access effectively and prevented unauthorized data access, thereby safeguarding sensitive customer information.

---
**Journey Progress:** 10/100 Days Complete 🚀