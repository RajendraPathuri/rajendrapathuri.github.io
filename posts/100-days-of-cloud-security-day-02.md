---
title: '100 Days of Cloud Security - Day 2: Defend'
date: '2025-11-11'
author: 'Venkata Pathuri'
excerpt: 'Day 2 of my cloud security journey - Defend'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 2: Defend

## Overview

Welcome back to my cloud security journey! Yesterday, we explored the attack vectors that can compromise cloud environments, focusing on the vulnerabilities that attackers exploit. Today, we shift gears from offense to defense, diving into practical strategies that can protect our AWS environments from privilege escalation attacks. By defending against the vulnerabilities we uncovered, we can build a robust security posture for our cloud resources.

## Learning Objectives

In today's lesson, we will master essential defensive strategies against specific IAM vulnerabilities, focusing on the `iam:SetDefaultPolicyVersion` abuse. We will learn to restrict dangerous IAM actions, implement logging and monitoring solutions, and create detection rules that enable us to respond swiftly to policy changes. By the end of this session, you'll be equipped with the knowledge to defend your AWS environment effectively and understand the importance of proactive security measures.

## Deep Dive

### Understanding IAM Policy Vulnerabilities

In our previous session, we identified a critical vulnerability that allows a non-privileged user, like `raynor`, to escalate their privileges by manipulating IAM policy versions. Attackers can exploit the permissions associated with actions such as `iam:GetPolicyVersion` and `iam:SetDefaultPolicyVersion` to gain unauthorized access to sensitive resources. This misuse underscores the importance of tightly controlling IAM permissions and understanding AWS's policy evaluation model.

#### Current Best Practices

To defend against these types of attacks, AWS recommends several best practices:

1. **Restrict Policy-Version APIs**: Create strict policies that deny non-privileged users the ability to manage IAM policy versions. This can be achieved using a policy like the following:

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

   This policy effectively denies access to dangerous actions for non-privileged users while allowing read-only actions.

2. **Remove Direct User Policy Attachments**: Instead of attaching policies directly to users, leverage IAM groups and roles. By creating a `privileged-admins` group, you can assign necessary permissions without exposing users to unnecessary risks.

3. **Enable Logging & Auditing**: CloudTrail is vital for tracking changes and monitoring activities in your AWS environment. Ensure it's enabled for all management events, includes log-file validation, and sends logs to CloudWatch for real-time monitoring.

### Visual Description

When you implement these strategies, your AWS Management Console will reflect a more organized IAM structure. You will see your `privileged-admins` group populated with the necessary permissions, while individual users like `raynor` will only have access to what they need. Additionally, CloudTrail logs will provide a comprehensive view of all account activity, empowering you to respond quickly to any suspicious actions.

## Hands-On Practice

1. **Restrict Policy-Version APIs**: Create an IAM policy with the provided JSON code and apply it either as a permission boundary or an organization-wide Service Control Policy (SCP) to ensure comprehensive enforcement.

2. **Remove Direct User Policy Attachments**: Detach the problematic policy from the `raynor` user and assign them to the `privileged-admins` group instead. You can do this via the AWS Management Console or AWS CLI.

3. **Enable CloudTrail**: If not already set up, navigate to the CloudTrail console, enable logging for all management events, and configure it to deliver logs to a centralized S3 bucket.

4. **Set Up CloudWatch Alerts**: Create rules in EventBridge to trigger alerts for any changes to policy versions or unauthorized access attempts to sensitive IAM actions.

### Expected Outcomes

After completing these tasks, you should have:

- A restricted IAM environment where non-privileged users cannot manipulate policy versions.
- Improved auditing capabilities through CloudTrail and CloudWatch, allowing for real-time monitoring of IAM activities.

### Common Troubleshooting Tips

- If your CloudTrail logs are not appearing, double-check the configuration settings and ensure that logging is enabled for all regions.
- For EventBridge rules, verify that the event pattern correctly matches the actions you want to monitor.

## Key Takeaways

In today's session, we learned that defending against cloud vulnerabilities requires a strategic approach to IAM permissions, robust logging, and continuous monitoring. By implementing strict policies, utilizing groups and roles, and setting up effective auditing mechanisms, we can significantly mitigate the risk of privilege escalation attacks. The importance of understanding AWS's policy evaluation model was highlighted, emphasizing the need for thoughtful policy design to prevent unauthorized access.

## Real-World Applications

In real-world cloud environments, these strategies are not just theoretical; they are essential components of a comprehensive security posture. Organizations like Netflix and Airbnb employ similar IAM governance practices to ensure that their teams can operate efficiently without compromising security. By appropriately managing IAM permissions and monitoring account activity, businesses can protect their sensitive resources and maintain compliance with industry regulations.

## What's Next?

As we move into Day 3, we will delve deeper into the world of monitoring and incident response. We will explore the tools and techniques that empower us to detect and respond to threats effectively, building upon the defensive measures we've established today. Get ready for an exciting exploration of how to stay one step ahead of potential threats in your cloud environment!

---
**Journey Progress:** 2/100 Days Complete 🚀