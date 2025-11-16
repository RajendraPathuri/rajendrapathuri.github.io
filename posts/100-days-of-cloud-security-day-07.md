---
title: '100 Days of Cloud Security - Day 7: Attack — `lambda_privesc`'
date: '2025-11-16'
author: 'Venkata Pathuri'
excerpt: 'Day 7 of my cloud security journey - Attack — `lambda_privesc`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 7: Attack — `lambda_privesc`

## Overview

Welcome back to Day 7 of our cloud security journey! Building on our foundational knowledge from Day 6, where we explored various IAM roles and permissions, today we delve into an exciting hands-on scenario: attacking the `lambda_privesc` CloudGoat lab. This exercise not only sharpens our enumeration and exploitation skills but also emphasizes the critical nature of permissions management within AWS environments. By the end of today, you'll gain a solid understanding of how privilege escalation can occur through AWS Lambda functions.

## Learning Objectives

Today, we aim to master the process of identifying attack vectors through enumeration, exploiting those vectors, and ultimately achieving elevated privileges within an AWS environment. You'll learn how to effectively utilize AWS IAM roles and policies, understand the implications of `iam:PassRole`, and employ Lambda functions to execute actions that can lead to administrative access. This exercise will empower you with practical skills that are vital in real-world cloud security assessments.

## Deep Dive

### Enumeration: The First Step in Cloud Penetration Testing

The first phase of any penetration test is enumeration, where we gather as much information as possible about the environment. In our case, we logged in as the user `chris-cgide3k5k2fwj7`, who has a managed policy allowing actions like `sts:AssumeRole`, `iam:List*`, and `iam:Get*`. This access is crucial; it hints at possible exploit paths, particularly the ability to assume roles that could grant broader permissions.

In our enumeration, we discovered two roles: `cg-debug-role-cgide3k5k2fwj7`, which has `AdministratorAccess`, and `cg-lambdaManager-role-cgide3k5k2fwj7`, which allows the user to manage Lambda functions and pass roles. The latter role's permissions, especially `iam:PassRole`, can be particularly powerful when misconfigured, as it enables users to execute code with elevated permissions.

### Exploitation and Privilege Escalation

After identifying potential roles, the next step is to exploit these findings. By assuming the `cg-lambdaManager-role-cgide3k5k2fwj7` role, we can create a Lambda function that uses the `cg-debug-role`, thus gaining administrative privileges.

The Lambda function we deployed was simple yet effective. It was coded to attach the `AdministratorAccess` policy to our user, leveraging the elevated permissions provided by the `cg-debug-role`. This highlights an essential concept: **the power of serverless architecture**. Lambda functions can be triggered to perform actions across AWS services without needing a dedicated server, which can be both a boon and a bane in terms of security.

### Best Practices in IAM and Lambda Security

To mitigate risks associated with privilege escalation, adhere to these best practices:
- **Principle of Least Privilege**: Always grant the minimum permissions necessary for users and roles to perform their tasks.
- **Regular Auditing**: Periodically review IAM roles and policies to ensure they align with your organizational security posture.
- **Use of Conditions in Policies**: Implement conditions in IAM policies to enforce context-aware access controls, such as IP restrictions.

## Hands-On Practice

Let's go through the hands-on steps you took today:

1. **Initial Enumeration**: You logged in and checked the permissions and roles attached to your user account. Using commands like `aws iam list-attached-role-policies`, you identified roles and their permissions.

2. **Assuming the Role**: You used the `aws sts assume-role` command to switch to the `cg-lambdaManager-role-cgide3k5k2fwj7`, which allowed you to gain temporary credentials for further actions.

3. **Creating and Invoking Lambda**: After packaging your Lambda function into a zip file, you created the function with the `aws lambda create-function` command, specifying the `cg-debug-role` as the execution role. You invoked the function using `aws lambda invoke`, which successfully attached the `AdministratorAccess` policy to your user.

4. **Verification**: By listing the attached policies on your user account, you confirmed the successful privilege escalation.

### Common Troubleshooting Tips

- If you encounter permission errors while assuming roles, double-check the trust relationships in the role's policy to ensure your user is allowed to assume it.
- Always verify that your Lambda function has the correct execution role assigned; this is crucial for it to perform actions on your behalf.

## Key Takeaways

Today’s exercise reinforced the importance of understanding IAM roles, policies, and the power of AWS Lambda in executing actions at scale. By successfully navigating the process from enumeration to exploitation, you have gained not only technical skills but also insights into the potential pitfalls of misconfigured permissions. Remember, while AWS offers powerful tools for managing resources, the responsibility lies with us to ensure they are secured against unauthorized access.

## Real-World Applications

In production environments, the lessons learned from today's exercise are invaluable. Organizations often face similar scenarios where users may inadvertently or maliciously exploit overly permissive IAM roles. Understanding how these attacks can unfold enables security teams to better prepare and defend against such threats. Regularly auditing IAM permissions and educating teams on secure coding practices for serverless architectures like AWS Lambda helps maintain a strong security posture.

---

**Journey Progress:** 7/100 Days Complete 🚀