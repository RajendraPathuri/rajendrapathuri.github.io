---
title: '100 Days of Cloud Security - Day 45: Hardening — iam_privesc_by_attachment'
date: '2025-12-24'
author: 'Venkata Pathuri'
excerpt: 'Day 45 of my cloud security journey - Hardening — iam_privesc_by_attachment'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 45: Hardening — iam_privesc_by_attachment

## Overview
As we continue our journey through cloud security, today we focus on the critical task of hardening our AWS environment against privilege escalation through IAM role attachments. Building upon the foundational principles established in Day 44, where we explored the significance of least privilege access, we now delve deeper into practical implementations that safeguard our resources from potential threats. Understanding how to properly configure IAM roles and EC2 instances is paramount to developing a robust security posture.

## Learning Objectives
In today's session, you will master the techniques for hardening your AWS infrastructure by implementing stringent IAM policies and EC2 configurations. You will learn how to restrict access, enforce metadata security, and minimize the risk of privilege escalation. By the end of this lesson, you'll have the tools and knowledge to significantly enhance your cloud environment's security while adhering to best practices.

## Deep Dive
### Understanding IAM Privilege Escalation
IAM privilege escalation occurs when users gain unauthorized access to resources by improperly attaching or leveraging IAM roles. To mitigate this risk, it is essential to meticulously define roles, permissions, and access controls.

### Hardening EC2 Instances
1. **Removing Unnecessary Ingress Access**: 
   - We start by tightening our security group rules. Access to ports 80 (HTTP) and 443 (HTTPS) is often unnecessary unless the application explicitly requires it. By removing these rules, we eliminate potential entry points for attackers.

2. **Implementing IMDSv2**: 
   - AWS Instance Metadata Service (IMDS) allows EC2 instances to access metadata about themselves. By enforcing IMDSv2, we prevent server-side request forgery (SSRF) attacks, which can exploit metadata to gain sensitive information.
   - Here's how you configure it in your `ec2.tf` file:
   ```hcl
   metadata_options {
     http_endpoint               = "enabled"
     http_tokens                 = "required"  # Enforces IMDSv2
     http_put_response_hop_limit = 1
   }
   ```

### Refining IAM Policies
1. **Explicit Deny Policy**: 
   - The `iam_meek.tf` file contains an explicit deny policy, which is a crucial component for creating a decoy role. This prevents unauthorized actions, ensuring that any attempt to escalate privileges is met with a hard stop.

2. **Implementing Least Privilege**: 
   - In your `iam_mighty.tf`, we have removed wildcard permissions that allow full administrative access. Instead, we restrict permissions to only what is necessary for EC2 operations, such as:
   ```json
   {
     "Action": [
       "ec2:DescribeInstances",
       "ec2:DescribeVolumes",
       "ec2:DescribeSnapshots"
     ],
     "Effect": "Allow",
     "Resource": "*"
   }
   ```

3. **Restricting Role Attachments**: 
   - We've removed permissions that allow the user to pass roles to EC2 instances (`iam:PassRole`), thus preventing the user from attaching powerful roles inadvertently.

### Resource-Specific Restrictions
In your `iam.tf`, we’ve implemented resource-specific restrictions using ARN conditions, which provide a finer level of control:
```json
"Resource": [
  "arn:aws:ec2:${region}:${account_id}:instance/*",
  "arn:aws:iam::${account_id}:role/cg-ec2-meek-role-*"
]
```

These granular permissions ensure that even if a role is attached, it cannot perform unauthorized actions on other resources.

## Hands-On Practice
To solidify your understanding, let’s implement these changes:

1. **Modify Security Group Rules**:
   - Using the AWS Management Console or the CLI, remove unnecessary ingress rules for your EC2 instance.
   - **Expected Outcome**: The EC2 instance should no longer accept traffic on ports 80 and 443.

2. **Update IAM Policies**:
   - Modify your IAM policies as discussed in the `iam_mighty.tf` and `iam.tf` files.
   - **Expected Outcome**: After applying these policies, test by attempting to perform actions that should be denied. Ensure that no unauthorized actions can be executed.

3. **Verification**:
   - Use the AWS CLI to describe your IAM roles and EC2 instances to confirm that the configurations are as expected.
   - Common troubleshooting tip: If you encounter permission errors, double-check your policy syntax and ensure that you have attached the correct policies to the user or role.

## Key Takeaways
Today’s learning emphasizes the importance of stringent IAM and EC2 configurations to prevent privilege escalation. By implementing least privilege principles, enforcing IMDSv2, and removing unnecessary permissions, you can significantly enhance your cloud security posture. This proactive approach not only protects your resources but also prepares you for real-world security challenges.

## Real-World Applications
In production environments, adhering to these hardening practices is not just recommended; it is essential. Organizations that fail to implement stringent access controls often find themselves vulnerable to insider threats and external attacks. By applying the techniques learned today, you can safeguard sensitive data and maintain compliance with regulatory standards, ultimately fostering trust with stakeholders and customers.

---
**Journey Progress:** 45/100 Days Complete 🚀