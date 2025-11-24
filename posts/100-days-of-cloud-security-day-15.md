---
title: '100 Days of Cloud Security - Day 15: Attack — `cloud_breach_s3`'
date: '2025-11-24'
author: 'Venkata Pathuri'
excerpt: 'Day 15 of my cloud security journey - Attack — `cloud_breach_s3`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 15: Attack — `cloud_breach_s3`

## Overview
Welcome to Day 15 of our cloud security journey! Having laid the groundwork in Day 14 by exploring the importance of securing cloud resources, today we shift gears to a more hands-on approach. We will deploy the `cloud_breach_s3` scenario and launch an attack to access confidential files in an S3 bucket. This practical exercise will not only deepen your understanding of cloud security vulnerabilities but also enhance your skills in penetration testing.

## Learning Objectives
By the end of this session, you will master the techniques necessary to exploit an insecure AWS environment. You will learn how to enumerate instance metadata, gain unauthorized access to sensitive information, and understand the implications of misconfigurations in cloud security. This hands-on experience will empower you to identify and mitigate similar vulnerabilities in real-world scenarios.

## Deep Dive
To successfully attack the `cloud_breach_s3` scenario, we need to understand some foundational concepts, particularly the Instance Metadata Service (IMDS). IMDS is accessible only from within an EC2 instance and provides critical information about the instance, including IAM role credentials. This service is key in our attack strategy, as it can expose sensitive access keys if not properly secured.

### Understanding IMDS
When an EC2 instance is launched, it can access IMDS via the IP address `169.254.169.254`. This IP is non-routable, meaning it cannot be accessed from outside the instance. By querying this address, we can retrieve important metadata about the instance, including:

- Instance ID
- AMI ID
- IAM role credentials

### Real-World Example
Imagine a cloud application that has been deployed without properly restricting IAM roles. An attacker, by simply leveraging the IMDS, can gain unauthorized access to sensitive data stored in S3. This scenario mimics common vulnerabilities seen in production environments, where developers may overlook security configurations.

### Step-by-Step Breakdown
1. **Initial Enumeration**: Using the `curl` command, we check the instance's startup IP to identify its configuration.
   ```bash
   curl 13.217.100.46
   ```

2. **Accessing Metadata**: By querying the metadata, we can discover the IAM role assigned to the instance.
   ```bash
   curl -s http://13.217.100.46/latest/meta-data/ -H 'Host:169.254.169.254'
   ```

3. **Retrieving IAM Credentials**: By navigating through the metadata, we can find the IAM security credentials, which may include access keys and tokens.
   ```bash
   curl -s http://13.217.100.46/latest/meta-data/iam/security-credentials/ -H 'Host:169.254.169.254'
   ```

4. **Accessing S3**: With the retrieved credentials, we can list and sync files from the S3 bucket, gaining access to confidential information.
   ```bash
   aws s3 ls s3://your-bucket-name
   ```

### Current Best Practices
- **Restrict Metadata Access**: Implement Instance Metadata Service Version 2 (IMDSv2) to prevent unauthorized access to metadata.
- **Use Least Privilege**: Follow the principle of least privilege in IAM roles to minimize access to only what is necessary.
- **Regular Audits**: Conduct regular security audits on IAM roles and their permissions.

## Hands-On Practice
To practice this attack, follow these steps:
1. Deploy the `cloud_breach_s3` scenario in your environment.
2. Execute the commands as outlined above to enumerate metadata and retrieve IAM credentials.
3. Use the AWS CLI to access S3 and verify the retrieval of sensitive files.

### Expected Outcomes
Once you successfully execute the commands, you should be able to see a list of files within the S3 bucket, demonstrating unauthorized access to what should have been secured data.

### Common Troubleshooting Tips
- Ensure that your AWS CLI is configured correctly with the necessary permissions to access S3.
- If you encounter errors, double-check your curl command syntax and ensure you are querying the correct metadata paths.

## Key Takeaways
In today's lesson, we learned the critical role of the Instance Metadata Service in AWS security and how attackers can exploit misconfigurations to gain access to sensitive data. By simulating the `cloud_breach_s3` attack, we reinforced the importance of securing IAM roles and implementing strong access controls. These skills are essential for anyone looking to fortify their cloud security posture.

## Real-World Applications
In actual production environments, understanding how attackers think and operate is crucial. Organizations often face breaches due to insufficient security measures around IAM roles and metadata. By applying the lessons learned today, you can help secure cloud resources by advocating for stronger security practices and educating teams on the importance of protecting sensitive data.

---
**Journey Progress:** 15/100 Days Complete 🚀