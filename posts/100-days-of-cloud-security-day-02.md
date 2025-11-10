---
title: '100 Days of Cloud Security - Day 2: Defend'
date: '2025-11-10'
author: 'Rajendra Pathuri'
excerpt: 'Day 2 of my cloud security journey - Defend'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 2: Defend

## Overview
Welcome back to the second day of our 100-day cloud security journey! After exploring attack vectors in our first day, today we shift gears to defend our cloud environment. We’ll focus on the CloudGoat lab scenario `iam_privesc_by_rollback`, where we’ll learn how to fortify our defenses against privilege escalation attacks that exploit IAM policy-version APIs. By the end of today, you will not only understand the vulnerabilities but also implement effective mitigations to secure your cloud environment.

## Learning Objectives
Today, we will master the art of cloud defense by identifying and mitigating IAM vulnerabilities. You will learn how to restrict dangerous IAM actions, enhance logging and monitoring capabilities, and create detection rules to alert you on suspicious activities. By the end of this session, you’ll have practical skills in Cloud Security Posture Management (CSPM) that will empower you to safeguard your cloud resources effectively.

## Deep Dive
In our lab scenario, we previously exploited a vulnerability that allowed the `raynor` user to escalate privileges by manipulating IAM policy versions. The root cause? The user had permissions to view and set policy versions (`iam:GetPolicyVersion`, `iam:ListPolicyVersions`, `iam:SetDefaultPolicyVersion`), which allowed them to roll back to a previously privileged policy version.

### Understanding IAM Permissions
AWS IAM operates on a principle of least privilege, meaning users should only have the permissions necessary to perform their job tasks. However, misconfigurations can lead to significant security risks. Here’s a breakdown of the policy evaluation process:

1. **Implicit Deny**: All actions are denied by default unless explicitly allowed.
2. **Explicit Deny**: Any explicit deny statement overrides any allows.
3. **Organizational Controls**: Service Control Policies (SCPs) can enforce broader restrictions at the account level.
4. **Resource-based Policies**: Policies attached directly to AWS resources, like S3 buckets.
5. **Identity-based Policies**: Policies attached to users, groups, or roles.
6. **Permissions Boundaries**: These set maximum permissions for a principal, ensuring that they can't exceed defined limits.
7. **Session Policies**: Temporary credentials can have additional restrictions.

### Real-World Examples
Consider a situation where an employee, during a routine job, inadvertently gets permissions that allow them to manage IAM policies. This oversight can lead to catastrophic privilege escalation. By implementing the restrictive policy below, you can prevent users from executing sensitive IAM actions unless they are part of a trusted role:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyPolicyVersionAccess",
      "Effect": "Deny",
      "Action": [
        "iam:GetPolicyVersion",
        "iam:ListPolicyVersions",
        "iam:CreatePolicyVersion",
        "iam:SetDefaultPolicyVersion"
      ],
      "Resource": "*"
    },
    {
      "Sid": "IAMReadOnlyAccess",
      "Effect": "Allow",
      "Action": [
        "iam:Get*",
        "iam:List*"
      ],
      "Resource": "*"
    }
  ]
}
```

### Best Practices
1. **Use Groups and Roles**: Attach permissions to groups or roles instead of directly to users. This improves manageability and makes it easier to audit permissions.
2. **Enable Logging**: Ensure that CloudTrail is turned on for all management events, allowing you to monitor changes in near-real-time and investigate incidents post-factum.
3. **Monitor Policy Changes**: Create detection rules in EventBridge or CloudWatch to alert you of changes to IAM policies or suspicious activity.

## Hands-On Practice
To implement our defenses effectively, follow these steps:

1. **Restrict Policy-Version APIs**: Apply the restrictive IAM policy to deny policy-version actions for non-privileged users.
2. **Detach Problematic Policies**: Remove any direct policy attachments from the `raynor` user and attach them to an appropriate group or role.
3. **Enable CloudTrail**: Make sure CloudTrail is configured to log management events and deliver logs to a centralized S3 bucket.
4. **Create Detection Rules**: Set up rules in EventBridge to catch any policy-version changes.

### Expected Outcomes
After applying these changes, the `raynor` user should no longer have the ability to escalate their privileges through policy version manipulation. You can verify this by attempting to execute IAM actions that were previously allowed.

### Common Troubleshooting Tips
- If you encounter issues with policy changes not taking effect, double-check the policy attachment and ensure there are no conflicting permissions.
- Look at CloudTrail logs to identify any unexpected behavior or access attempts.

## Key Takeaways
Today, we learned how to defend our cloud environment against IAM-related vulnerabilities by restricting sensitive IAM actions and enhancing our monitoring capabilities. By understanding the policy evaluation process, implementing best practices, and utilizing effective logging and detection strategies, we can significantly reduce the risk of privilege escalation attacks. Remember, a proactive approach to security is always better than a reactive one.

## Real-World Applications
In production environments, applying these principles can prevent unauthorized access and mitigate the risks associated with human error in permission management. Companies that have implemented stringent IAM policies and monitoring have reported a significant decrease in security incidents related to privilege escalation.

## What's Next?
As we prepare for Day 3, we’ll delve deeper into cloud security architecture and explore how to enforce security best practices across multiple accounts and services. This foundational knowledge will be crucial as we build our expertise in cloud security.

---
**Journey Progress:** 2/100 Days Complete 🚀