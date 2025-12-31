---
title: '100 Days of Cloud Security - Day 52: Attack - detection_evasion - Part 1'
date: '2025-12-31'
author: 'Venkata Pathuri'
excerpt: 'Day 52 of my cloud security journey - Attack - detection_evasion - Part 1'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 52: Attack - detection_evasion - Part 1

## Overview
In today's lesson, we dive into the intricate world of detection evasion techniques, focusing on how attackers can stealthily access secrets stored in AWS Secrets Manager. Building on the foundational knowledge we gained in Day 51, where we explored AWS IAM policies and user permissions, we will now see how this knowledge can be used to bypass security mechanisms without raising alarms. Understanding these techniques is essential for strengthening your cloud security posture and staying ahead of potential threats.

## Learning Objectives
By the end of this session, you will master the skills necessary to recognize and mitigate detection evasion tactics. You will learn how to identify legitimate credentials, enumerate permissions, analyze infrastructure, and understand the mechanisms in place that can alert security teams to suspicious activity. This knowledge equips you to better secure AWS environments and respond effectively to potential security breaches.

## Deep Dive
### Detection Evasion Techniques
Detection evasion is a critical area of concern in cloud security, particularly when it comes to managing sensitive data. Attackers often exploit legitimate user credentials and the infrastructure's inherent trust to carry out their activities without detection. 

#### Phase 1: Identify Legitimate Credentials
The first step in our scenario is to verify user identities. We have set up four IAM users, and our goal is to determine which ones are legitimate and which are honeytokens—decoys designed to lure attackers.

For instance, when checking the identity of user `r_waterhouse` using the following command:

```bash
aws sts get-caller-identity --profile cg-4
```

The output reveals that this user is legitimate, as it does not follow the honeytoken format. Conversely, other user identities show characteristics typical of honeytokens, indicating they are traps set for malicious actors.

#### Phase 2: Enumerate Permissions
Next, we explore user groups and their associated policies. By running:

```bash
aws iam list-groups-for-user --user-name r_waterhouse --profile cg-4
```

we find that `r_waterhouse` is part of the `cg-developers` group, which has been granted the `ReadOnlyAccess` policy. This step is crucial for understanding what permissions the legitimate user has and how they can be exploited.

#### Phase 3: Analyze Infrastructure
We then analyze the EC2 instances available in our environment. Knowing which instances are accessible allows us to ascertain the best path for our intended attack. Using:

```bash
aws ec2 describe-instances --profile cg-4
```

we can identify which instance (easy path) has a public IP, enabling us to connect to it directly without arousing suspicion.

#### Phase 4: Understand Detection Mechanisms
Understanding AWS's detection mechanisms is pivotal in executing a stealthy attack. By checking CloudWatch metric filters, we see that certain actions will trigger alerts. For example, any usage of honeytoken credentials will raise a flag, making it essential to use legitimate credentials to avoid detection.

#### Phase 5: Execute Easy Path Attack
Finally, we proceed with the attack on the easy path instance. Connecting to it via SSM allows us to use the instance's role permissions to retrieve secrets without triggering detection mechanisms. 

By executing:

```bash
aws ssm start-session --target i-021a566151348aaf8 --profile cg-4
```

we gain shell access as `ssm-user`. From there, we can fetch the temporary credentials and, subsequently, access the secrets in Secrets Manager using commands like:

```bash
aws --region us-east-1 secretsmanager get-secret-value --secret-id cgidtnxnoeqpeo_easy_secret
```

This reveals the secret value, demonstrating how attackers can exploit legitimate access pathways.

## Hands-On Practice
To practice these techniques, follow these steps in your own AWS environment (make sure to use the following example credentials):

1. **Verify User Credentials:**
   ```bash
   aws sts get-caller-identity --profile cg-4
   ```

2. **List User Groups:**
   ```bash
   aws iam list-groups-for-user --user-name r_waterhouse --profile cg-4
   ```

3. **Describe EC2 Instances:**
   ```bash
   aws ec2 describe-instances --profile cg-4
   ```

4. **Start an SSM Session:**
   ```bash
   aws ssm start-session --target i-021a566151348aaf8 --profile cg-4
   ```

5. **Get Temporary Credentials:**
   ```bash
   curl http://169.254.169.254/latest/meta-data/iam/security-credentials/
   ```

6. **Retrieve Secret:**
   ```bash
   aws --region us-east-1 secretsmanager get-secret-value --secret-id cgidtnxnoeqpeo_easy_secret
   ```

Ensure to replace placeholders with your actual credentials where indicated.

### Common Troubleshooting Tips:
- If you encounter permission errors, verify that the IAM user has the necessary roles and policies attached.
- Ensure that the EC2 instance is configured to allow SSM access.
- Double-check the region specified in your commands to avoid discrepancies.

## Key Takeaways
Today, we uncovered the methods used in detection evasion attacks, focusing on how attackers exploit legitimate access to secrets. We learned to identify honeytokens, enumerate permissions, and utilize AWS's built-in tools like SSM to gain unauthorized access while avoiding detection. This knowledge is vital for anyone involved in maintaining a secure AWS environment.

## Real-World Applications
The ability to detect and respond to evasion techniques is crucial for organizations leveraging cloud technologies. By understanding how attackers operate, security teams can implement more robust monitoring and detection strategies, ensuring that legitimate user activities do not mask malicious actions. This knowledge empowers security professionals to build resilient defenses against potential threats, ultimately safeguarding sensitive data in production environments.

---
**Journey Progress:** 52/100 Days Complete 🚀