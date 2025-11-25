---
title: '100 Days of Cloud Security - Day 16: Defend - `cloud_breach_s3`'
date: '2025-11-25'
author: 'Venkata Pathuri'
excerpt: 'Day 16 of my cloud security journey - Defend - `cloud_breach_s3`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 16: Defend - `cloud_breach_s3`

## Overview
Welcome back to our cloud security journey! Building on the foundational knowledge from Day 15, where we explored the importance of IAM roles and permissions, today we will delve deeper into securing our AWS environments. Specifically, we’ll focus on the `cloud_breach_s3` scenario, where we will learn to defend against potential breaches by securing S3 data and hardening EC2 instance settings. By the end of this day, you’ll not only understand how to mitigate risks associated with credential exposure but will also be equipped with practical steps to implement robust security measures.

## Learning Objectives
Today’s goal is clear: you will master the art of securing S3 data and preventing unauthorized access by focusing on two critical areas—harden IAM roles and properly configure the Instance Metadata Service (IMDS). You will learn to apply the principle of least privilege to IAM policies and enforce best practices for IMDS configurations. By taking these steps, you will gain confidence in protecting sensitive data and safeguarding your cloud infrastructure from potential vulnerabilities.

## Deep Dive
### Understanding the Vulnerability
The `cloud_breach_s3` scenario illustrates a common yet critical vulnerability: improper exposure of the Instance Metadata Service (IMDS) on an EC2 instance. The IMDS is a vital feature that allows instances to retrieve metadata about themselves, including temporary IAM credentials linked to their assigned roles. In this case, an attacker exploited the metadata endpoint to gain access to sensitive IAM credentials with overly broad permissions, leading to unauthorized access to all S3 buckets in the account.

### IAM Role Hardening
To address the IAM role vulnerability, we began by removing the `AmazonS3FullAccess` policy from the role `cg-banking-WAF-Role-cgidgiozej0wwy`. Instead, we applied a least-privilege policy that restricts access only to the specific S3 buckets necessary for the application. This approach is fundamental in minimizing the attack surface and ensuring that roles only have the permissions they absolutely need.

#### Best Practice:
- **Define Specific Permissions:** When establishing IAM roles, always adhere to the principle of least privilege. This means granting only the permissions necessary for the role’s function. For example, if the role only requires access to a bucket named `my-secure-bucket`, specify that instead of granting blanket access.

### Enforcing IMDSv2
Next, we enabled IMDSv2, which is a more secure version of the Instance Metadata Service. Unlike IMDSv1, which can be exploited through Server-Side Request Forgery (SSRF) attacks, IMDSv2 requires a session token for access. This enhancement significantly reduces the risk of attackers obtaining IAM credentials via simple HTTP requests.

#### Visual Description:
When you enable IMDSv2, the EC2 instance metadata endpoint (`http://169.254.169.254/latest/meta-data/`) will only respond to requests that include a valid session token, effectively creating an additional layer of security. 

#### Best Practice:
- **Implement IMDSv2:** Transitioning to IMDSv2 should be a top priority for any organization using AWS. It not only bolsters security but also aligns with AWS's commitment to best practices.

### Network-Level Restrictions
To further secure access to the metadata service, we implemented network-level restrictions to block direct access to the metadata IP (`169.254.169.254`) from unauthorized proxies or applications. By controlling network routes, we can prevent malicious actors from reaching the metadata endpoint.

## Hands-On Practice
1. **IAM Role Hardening:**
   - Navigate to the IAM console in AWS.
   - Select the role `cg-banking-WAF-Role-cgidgiozej0wwy`.
   - Remove the `AmazonS3FullAccess` policy and attach a least-privilege policy specifying access only to necessary S3 buckets.
   
   *Expected Outcome:* The role should now only have access permissions to the specified buckets, reducing exposure.

2. **Enable IMDSv2:**
   - In the EC2 console, select your instance and navigate to the "Actions" menu.
   - Under "Instance Settings," select "Modify Instance Metadata Service."
   - Choose "Enabled" for IMDSv2 and save your changes.

   *Expected Outcome:* IMDSv2 should now be enforced, requiring session tokens for metadata access.

3. **Verify Configuration:**
   - Use tools such as Prowler and ScoutSuite to ensure that the new configurations are effective and no vulnerabilities remain.

   *Common Troubleshooting Tips:*
   - If you encounter issues accessing metadata, double-check that session tokens are being used correctly and that network restrictions are properly configured.

## Key Takeaways
Today, we emphasized the importance of securing AWS resources by addressing vulnerabilities in IAM roles and the Instance Metadata Service. By implementing least-privilege principles and transitioning to IMDSv2, you can significantly reduce the risk of credential exposure and unauthorized access. Remember, security is a continuous process, and staying informed about best practices is key to maintaining robust defenses.

## Real-World Applications
Organizations in various industries face the challenge of securing sensitive data stored in S3 buckets while maintaining operational efficiency. By applying the lessons learned today, you will be better prepared to defend your AWS environments against breaches. Implementing strict IAM policies and enforcing secure metadata access can help organizations protect their assets and comply with regulatory requirements, ultimately enhancing their overall security posture.

---
**Journey Progress:** 16/100 Days Complete 🚀