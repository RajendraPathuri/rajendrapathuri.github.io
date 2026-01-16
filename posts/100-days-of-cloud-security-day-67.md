---
title: '100 Days of Cloud Security - Day 67: PWNED LABS - Execute and Identify Credential Abuse in AWS'
date: '2026-01-16'
author: 'Venkata Pathuri'
excerpt: 'Day 67 of my cloud security journey - PWNED LABS - Execute and Identify Credential Abuse in AWS'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 67: PWNED LABS - Execute and Identify Credential Abuse in AWS

## Overview
Welcome to Day 67 of our cloud security journey! Today, we delve into the world of credential abuse, a critical aspect of cloud security that can lead to unauthorized access and data breaches. Picking up from our previous exploration of IAM roles and permissions, we will now see how even a small oversight, such as a misconfigured public S3 bucket, can lead to significant security vulnerabilities. By the end of this session, you'll have practical insights into identifying and exploiting such vulnerabilities responsibly.

## Learning Objectives
In today's lesson, we aim to empower you with the skills to recognize the signs of credential abuse in AWS environments. You will learn how to conduct initial reconnaissance, identify hardcoded secrets, and explore the implications of compromised AWS credentials. Additionally, you will become familiar with tools like `aws_enumerator` and `GoAWSConsoleSpray`, and understand how to safely extract data while maintaining ethical standards. 

## Deep Dive

### Initial Reconnaissance (Public S3 Bucket)
Our journey begins with an S3 bucket named `hl-storage-general`. In this scenario, it was configured as a public bucket, allowing easy access to its contents. 

- **Target Endpoint:** 
  ```
  https://hl-storage-general.s3.us-east-1.amazonaws.com
  ```

When we accessed this URL, we discovered a backup file located at:
```
migration/asana-cloud-migration-backup.json
```

### Credential Compromise (Hardcoded Secrets)
Upon inspecting the JSON file, we found a "notes" field containing AWS credentials for a user named `migration-test`. Here’s an example of what was discovered:

```json
"notes" : "Access key ID,\nAKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours\n\nSecret access key\nwJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
```

This is a clear demonstration of how sensitive information can be unintentionally exposed through improper configuration. Always remember to avoid hardcoding secrets directly in your code or configuration files.

### Enumeration & Lateral Movement
Using the compromised credentials, we leveraged the `aws_enumerator` tool to probe what actions the user `migration-test` could perform. The findings were revealing:

- **Permissions:**
  - ListTables
  - DescribeEndpoints
  - DescribeLimits

- **Targeted Resources:**
  - Read access to the `analytics_app_users` DynamoDB table.
  - Restricted access to the `user_order_logs` table.

This step illustrates how attackers can enumerate permissions to understand their foothold in the environment.

### Exploitation & Exfiltration

#### Data Dumping & Hash Cracking
With access to `analytics_app_users`, we extracted user data, which included `UserID`s and `PasswordHash` entries. 

1. Extracted hashes were identified as **SHA-256**.
2. We utilized **John the Ripper** with the `rockyou.txt` wordlist to crack these hashes, successfully recovering 18 valid username/password combinations.

#### Credential Stuffing (Console Access)
Next, we attempted to log in to the AWS Console using the cracked credentials with a tool called `GoAWSConsoleSpray`. Our efforts bore fruit:

- **User:** `rstead`
- **Password:** `Abc123!!`
- **MFA:** Disabled

This step emphasizes the importance of enabling Multi-Factor Authentication (MFA) to add an additional layer of security.

#### Final Exfiltration (PII)
Once logged in as `rstead`, we discovered that this user had elevated privileges, allowing us to access the `user_order_logs` DynamoDB table. The data exfiltrated included sensitive information such as order history, physical addresses, GPS coordinates, and user IP addresses—highlighting the devastating impact of credential abuse.

## Hands-On Practice
To practice these concepts in a secure and ethical way, you might set up a similar environment using AWS. Here are some steps to guide your practice:

1. **Set Up an S3 Bucket**: Create a public S3 bucket and upload a JSON file with example AWS credentials (using placeholders).
2. **Use AWS CLI**: Simulate the enumeration process:
   ```bash
   aws configure
   # Replace with your actual credentials
   export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours
   export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
   ```
3. **Enumerate IAM Permissions**: Utilize the `aws_enumerator` tool to check permissions for your test user.
4. **Extract Data**: If you have a test DynamoDB setup, practice extracting and analyzing data safely.

### Troubleshooting Tips
- Ensure your AWS CLI is configured properly.
- Double-check IAM policies for the user to ensure you have the right permissions.
- Remember to clean up any resources you create to avoid unnecessary charges.

## Key Takeaways
Today, we learned the critical importance of securing AWS credentials and the vulnerabilities that can arise from improper configurations. Credential abuse can lead to severe data breaches, and understanding how attackers exploit these weaknesses is essential for safeguarding cloud environments.

## Real-World Applications
In production environments, the principles learned today can help organizations establish robust security postures. Securing sensitive data, implementing strict access controls, and regularly auditing IAM roles are all best practices that can mitigate the risks associated with credential abuse. By fostering a culture of security awareness and utilizing tools to regularly monitor for vulnerabilities, organizations can protect themselves from potential breaches.

---
**Journey Progress:** 67/100 Days Complete 🚀