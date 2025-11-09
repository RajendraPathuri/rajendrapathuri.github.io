---
title: '100 Days of Cloud Security - Day 1: Attack or Defend'
date: '2025-11-09'
author: 'Rajendra Pathuri'
excerpt: 'Day 1 of my cloud security journey - Attack or Defend'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 1: Attack or Defend

## Overview
Welcome to Day 1 of my 100-day cloud security learning journey! Today, we embark on an exciting exploration of cloud security concepts by diving into the intriguing dilemma of whether to attack or defend. Building on the foundational knowledge from Day 0, where we set up our learning environment, we will engage in a practical exercise using the CloudGoat tool. This experience will help us understand the vulnerabilities in cloud configurations and how to effectively secure them.

## Learning Objectives
By the end of today's session, you'll master the essential skills of identifying and exploiting vulnerabilities in AWS IAM policies. You'll learn to deploy the CloudGoat scenario `iam_privesc_by_rollback`, escalating a user’s privileges by manipulating policy versions. More importantly, you will grasp the strategic mindset of understanding vulnerabilities through the lens of both an attacker and a defender, enhancing your overall security posture.

## Deep Dive
Cloud security is a dynamic field that necessitates a comprehensive understanding of both offensive and defensive strategies. Today, we focus on the IAM (Identity and Access Management) service in AWS, which is critical for controlling access to resources. In our scenario, we will engage in privilege escalation—where an attacker gains elevated access to resources that they are normally restricted from accessing.

The `iam_privesc_by_rollback` scenario demonstrates a common vulnerability: the ability to modify IAM policy versions. AWS allows multiple versions of a managed policy, and if misconfigured, attackers can switch from a less privileged version to a more permissive one. 

### Step-by-Step Breakdown:
1. **Confirm Identity**: We begin by confirming our identity within the AWS environment using the command:
   ```bash
   aws sts get-caller-identity --profile cloudgoat
   ```
   This verifies our current IAM user and ensures we are operating within the correct account.

2. **List IAM Users**: Next, we list out the IAM users:
   ```bash
   aws iam list-users --profile cloudgoat
   ```
   Here, we identify the `raynor-cgiddrtz03apx6` user, the target for our privilege escalation exercise.

3. **Examine Policies**: Understanding the policies attached to our user is essential. We check inline and managed policies:
   ```bash
   aws iam list-user-policies --user-name "raynor-cgiddrtz03apx6" --profile cloudgoat
   aws iam list-attached-user-policies --user-name "raynor-cgiddrtz03apx6" --profile cloudgoat
   ```
   This allows us to see which policies currently govern the user’s actions.

4. **Inspect Policy Versions**: We then delve into the policy versions to uncover any vulnerabilities:
   ```bash
   aws iam list-policy-versions --policy-arn arn:aws:iam::997581282912:policy/cg-raynor-policy-cgiddrtz03apx6 --profile cloudgoat
   ```
   By examining the versions, we can identify which one has more permissive permissions.

5. **Restore Privileged Version**: Finally, we exploit the vulnerability by setting a more permissive policy version as the default:
   ```bash
   aws iam set-default-policy-version --policy-arn arn:aws:iam::997581282912:policy/cg-raynor-policy-cgiddrtz03apx6 --version-id v3 --profile cloudgoat
   ```
   This action showcases how easily an attacker could gain full access if proper safeguards are not in place.

## Hands-On Practice
To solidify your understanding, implement the commands listed above in your CloudGoat scenario. 

- **Expected Outcomes**: Each command should provide outputs confirming your actions, such as listing users, showing policy versions, and confirming policy changes. 
- **Verifying Success**: After setting the default policy version, re-run the command to get the policy metadata to ensure the `DefaultVersionId` reflects the change to `v3`.

### Common Troubleshooting Tips:
- If you encounter permission errors, double-check your AWS profile settings. Ensure you are using the isolated lab account to avoid conflicts with existing permissions.
- Use descriptive flags when running AWS CLI commands to troubleshoot any issues with output clarity.

## Key Takeaways
Today, we explored the duality of attacking and defending within the context of cloud security. By attacking first, we identified a vulnerability that could be exploited and thus understood the importance of proactive defense measures. We learned that IAM policies must be carefully managed to prevent malicious privilege escalation, a crucial lesson for any cloud security professional.

## Real-World Applications
Understanding these concepts is vital in production environments where misconfigured IAM policies can lead to severe security breaches. Organizations must adopt a rigorous policy versioning strategy, regularly auditing IAM roles and permissions to ensure that no unnecessary privileges exist. Real-world breaches often stem from such misconfigurations, making this knowledge essential for any cybersecurity practitioner.

## What's Next?
As we move to Day 2, we will delve deeper into the tools and techniques for securing cloud environments. Expect to explore best practices for IAM policies and how to implement these strategies to build a robust security framework.

---
**Journey Progress:** 1/100 Days Complete 🚀