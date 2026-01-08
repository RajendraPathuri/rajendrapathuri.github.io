---
title: '100 Days of Cloud Security - Day 60: PWNED LABS - Secure S3 with Amazon Macie'
date: '2026-01-08'
author: 'Venkata Pathuri'
excerpt: 'Day 60 of my cloud security journey - PWNED LABS - Secure S3 with Amazon Macie'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 60: PWNED LABS - Secure S3 with Amazon Macie

## Overview
Welcome back to Day 60 of our cloud security journey! As we continue to deepen our understanding of AWS security, today we explore Amazon Macie, a powerful tool specifically designed to enhance the security posture of your S3 buckets. Building on our previous discussions about data classification and access management, we will discover how automation can help us identify sensitive data and mitigate risks in our cloud environment.

## Learning Objectives
By the end of today's session, you will master how to utilize Amazon Macie to scan your S3 buckets for sensitive information, understand the implications of public exposure, and learn how to create custom data identifiers using regular expressions. You’ll also gain insights into the common pitfalls associated with hardcoding sensitive credentials and how to effectively remediate such security risks.

## Deep Dive
Amazon Macie is an intelligent security service that provides automated data discovery and classification for data stored in S3. Its pre-trained detection capabilities can identify various types of sensitive information, including personally identifiable information (PII) and AWS credentials. 

When you access the Macie Summary dashboard, you are greeted with a high-level overview of your AWS environment. You’ll see metrics such as the number of scanned accounts, S3 buckets covered, and any public exposure risks. For example, upon scanning, you might find that 3 out of your 6 S3 buckets are flagged as "Publicly accessible"—a significant security concern that warrants immediate attention.

![Macie Summary Dashboard](../img/day60-01.png)

### S3 Buckets Overview
Diving deeper into the "S3 buckets" view, you will encounter a heat map showcasing the sensitivity scores of your S3 buckets. A bucket with a high sensitivity score, such as `hlogistics-beta` with a score of **61**, signals that it contains potentially sensitive information.

Upon examining this bucket, you might discover that it contains hardcoded AWS credentials in a Python script named `System Tracking PackagesTest.py`. This finding is alarming because it represents a **High Severity** risk. The hardcoded credentials look something like this:

```python
# Replace with your actual credentials
AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours"
AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
```

This approach is a common pitfall, as anyone with read access to the public bucket can potentially use these credentials to access your AWS account. Best practices recommend using IAM roles and environment variables instead of hardcoding sensitive information directly into your code.

### Sensitivity and Coverage Issues
During the analysis, you may encounter classification errors or access denied issues, which indicate that Macie couldn't fully scan certain buckets. These blind spots can lead to undetected vulnerabilities, emphasizing the importance of ensuring that your S3 bucket policies are configured correctly.

## Hands-On Practice
To further enhance your understanding of sensitive data discovery, let's create a **Custom Data Identifier** in Amazon Macie to locate MD5 hashes. An MD5 hash is a 32-character hexadecimal string, and the regex pattern to identify it is `[a-fA-F0-9]{32}`.

However, if you find your permissions do not allow you to create custom identifiers, you can resort to manual review. This means you will look through files in your S3 buckets, or, if you have access to the previously leaked credentials, you might temporarily elevate your access to scan these files programmatically.

To manually check for MD5 hashes, you can use the AWS CLI commands to list objects and output their contents:

```bash
aws s3 ls s3://hlogistics-beta/
```

Once you've identified files of interest, use:

```bash
aws s3 cp s3://hlogistics-beta/SystemTrackingPackagesTest.py ./local_copy.py
```

After copying, review the local file to identify any patterns or sensitive information.

## Key Takeaways
Today, we explored the critical role of Amazon Macie in enhancing the security of your S3 buckets. We learned to identify sensitive data, recognize the risks of hardcoded credentials, and the importance of permissions when utilizing automated tools. By following best practices—such as avoiding hardcoding sensitive information and using IAM roles—we can significantly reduce our risk exposure in the cloud.

## Real-World Applications
In real-world scenarios, organizations often face challenges related to data exposure and compliance. By implementing Amazon Macie, businesses can automate their data discovery processes, ensuring that sensitive information is adequately protected. This not only helps in maintaining compliance with regulations like GDPR and HIPAA but also fosters a culture of security awareness among developers and operations teams.

---
**Journey Progress:** 60/100 Days Complete 🚀