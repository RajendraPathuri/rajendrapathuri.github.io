---
title: '100 Days of Cloud Security - Day 61: PWNED LABS - Investigate Threats with Amazon Detective'
date: '2026-01-09'
author: 'Venkata Pathuri'
excerpt: 'Day 61 of my cloud security journey - PWNED LABS - Investigate Threats with Amazon Detective'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 61: PWNED LABS - Investigate Threats with Amazon Detective

## Overview
Welcome back to Day 61 of our cloud security journey! Today, we continue to build upon our previous explorations in AWS security by diving into Amazon Detective. This powerful tool allows security teams to investigate threats and gain insights from various AWS data sources. In this session, we’ll analyze a real-world scenario involving a potential credential compromise, helping you understand how to leverage Amazon Detective for effective threat investigation.

## Learning Objectives
By the end of this session, you will not only grasp the core functionalities of Amazon Detective but also understand its integration with key AWS services like GuardDuty and CloudTrail. You will learn how to interpret findings from a threat investigation, utilize data to uncover malicious activities, and strengthen your cloud security posture against potential vulnerabilities.

## Deep Dive
Amazon Detective is designed to simplify the threat detection process in AWS environments. It aggregates and analyzes data from various sources, including Amazon GuardDuty, AWS CloudTrail logs, VPC flow logs, and CloudWatch logs, to provide actionable insights. 

### The Attack Sequence
In our investigation, we encountered a finding related to the IAM User `detective-user`, which was flagged for suspicious activities involving the S3 bucket `huge-logistics-veeam-migration`. The timeline of events provides a clear indication of the attacker's activities:

1. **Initial Reconnaissance (11:43:10 UTC)**: The attacker invoked the API `iam:GetAccessKeyLastUsed` from a remote Kali Linux machine, checking the validity of the compromised credentials. This action was traced back to the IP address `110.235.160.53`, located in Mandaluyong, PH, and connected to a suspicious network identified as `RADIUS TELECOMS, INC.`.

2. **Discovery (11:43:35 UTC)**: The attacker used `s3:ListObjects` on the targeted bucket, indicating an attempt to enumerate the contents.

3. **Exfiltration (11:43:53 UTC)**: Finally, the attacker executed `s3:GetObject` to exfiltrate sensitive data from the bucket.

These actions correlate with several MITRE tactics, including Discovery, Exfiltration, and Initial Access, highlighting the systematic nature of the attack.

### Visual Analysis
When using Amazon Detective, users will typically see a structured timeline of actions, along with associated signals and alerts. The findings will not only depict the sequence of events but also categorize them under specific attack tactics and techniques, allowing for a clearer understanding of the threat landscape.

### Best Practices
To enhance the security of your AWS environment, consider the following best practices:

- **Limit Public Access**: The S3 bucket in our scenario had public access enabled. Always ensure that S3 buckets are private unless absolutely necessary. Use bucket policies and IAM roles to restrict access.
  
- **Monitor API Calls**: Utilize CloudTrail to continuously monitor API calls, enabling you to detect unusual patterns.

- **Implement IAM Best Practices**: Regularly review IAM user permissions and practice the principle of least privilege to minimize potential risks.

## Hands-On Practice
To reinforce your understanding, let’s conduct a practical exercise in AWS. Here’s how you can investigate similar findings using Amazon Detective:

1. **Access Amazon Detective**: Navigate to the AWS Management Console and select Amazon Detective.

2. **Select Your Data Source**: Choose the data source from which you want to pull findings (e.g., GuardDuty).

3. **Analyze Findings**: Click on the specific finding related to your IAM user. You should see detailed insights into the attack sequence, including timestamps and API calls made.

4. **Verify Permissions**: Check the IAM permissions for `detective-user` to ensure they align with best practices. Use the following commands to list the user permissions:
   ```bash
   aws iam list-attached-user-policies --user-name detective-user --profile myProfile # Replace with your actual IAM profile
   ```

5. **Review S3 Bucket Policies**: Ensure that the S3 bucket policies do not allow public access:
   ```bash
   aws s3api get-bucket-policy --bucket huge-logistics-veeam-migration --profile myProfile # Replace with your actual IAM profile
   ```

### Common Troubleshooting Tips
- If you encounter issues accessing Detective, ensure your IAM role has the necessary permissions.
- Always check for network connectivity if you experience delays in retrieving data.

## Key Takeaways
Today, we explored the critical importance of Amazon Detective in identifying and investigating potential security threats in your AWS environment. By analyzing a real-world scenario involving credential compromise, we learned how to interpret findings and apply best practices to safeguard our cloud resources. Remember, the key to effective security measures lies in continuous monitoring and proactive management of your cloud environment.

## Real-World Applications
In production environments, the lessons learned from today’s investigation can be invaluable. Organizations that utilize Amazon Detective can swiftly identify and respond to security incidents, minimizing the impact of potential breaches. By integrating Detective with other AWS services, security teams can create a comprehensive security strategy that not only detects threats but also effectively mitigates them before they escalate.

---
**Journey Progress:** 61/100 Days Complete 🚀