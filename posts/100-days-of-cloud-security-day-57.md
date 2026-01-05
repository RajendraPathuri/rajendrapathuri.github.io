---
title: '100 Days of Cloud Security - Day 57: PWNED LABS - Identify IAM Breaches with CloudTrail and Athena'
date: '2026-01-05'
author: 'Venkata Pathuri'
excerpt: 'Day 57 of my cloud security journey - PWNED LABS - Identify IAM Breaches with CloudTrail and Athena'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 57: PWNED LABS - Identify IAM Breaches with CloudTrail and Athena

## Overview
Welcome to Day 57 of our cloud security journey! Today, we are delving into a critical aspect of AWS security—identifying IAM breaches using AWS CloudTrail and Athena. Building upon our previous discussions on access management strategies, we will analyze how to detect malicious IAM activity and compromised credentials within an AWS environment. As threats evolve, understanding how to monitor and respond to suspicious behavior is paramount for maintaining a secure cloud architecture.

## Learning Objectives
By the end of today's session, you will master the ability to identify malicious IAM activity, pinpoint compromised credentials, and recover hidden artifacts in your AWS environment. You will gain hands-on experience using AWS CloudTrail for logging API calls and AWS Athena for querying these logs. This practical knowledge will empower you to safeguard your resources against unauthorized access effectively.

## Deep Dive

### The Power of CloudTrail and Athena
AWS CloudTrail is a vital service that captures and logs all API calls across your AWS account, providing you with essential insights into account activity—the "who, what, where, and when" of actions taken in your environment. Pairing CloudTrail with AWS Athena allows you to leverage SQL queries to sift through massive logs stored in S3, making it easier to identify anomalies.

### Identifying Malicious IAM Activity
**Theory:** 
Attackers often employ automated tools to execute brute-force attacks or enumerate user accounts. In CloudTrail logs, this can manifest as repeated authentication failures or attempts to access resources without the necessary permissions. 

**Investigation:** 
Consider a suspicious event log indicating a console login failure:

```json
{
    "eventVersion": "1.08",
    "userIdentity": {
        "type": "IAMUser",
        "accountId": "104506445608",
        "accessKeyId": "",
        "userName": "HIDDEN_DUE_TO_SECURITY_REASONS"
    },
    "eventTime": "2023-08-30T21:50:02Z",
    "eventSource": "signin.amazonaws.com",
    "eventName": "ConsoleLogin",
    "awsRegion": "us-east-1",
    "sourceIPAddress": "195.70.73.130",
    "userAgent": "Go-http-client/1.1",
    "errorMessage": "No username found in supplied account",
    "responseElements": {
        "ConsoleLogin": "Failure"
    }
}
```

### Analysis
The `userAgent` indicates the use of a script, while the `errorMessage` points towards an enumeration attack. This leads us to run a targeted query to isolate relevant entries:

```sql
SELECT
    userIdentity.userName,
    userAgent, 
    eventTime
FROM
    cloudtrail_logs_aws_cloudtrail_logs_104506445608_4e45885e
WHERE
    eventType='AwsConsoleSignIn'
```

Upon executing this query, we discover multiple login attempts on `2023-08-30`, corroborating our suspicion of a brute-force attack.

### Identifying Compromised Credentials
**Theory:** 
To pinpoint the breach, we focus on any successful logins following multiple failed attempts and check for unauthorized access to resources.

**Investigation:** 
Leveraging the attack date, we refine our search for valid usernames:

```sql
SELECT
    userIdentity.userName,
    sourceipaddress,
    userAgent
FROM
    cloudtrail_logs_aws_cloudtrail_logs_104506445608_4e45885e
WHERE
    eventType='AwsConsoleSignIn'
AND
    eventTime LIKE '%2023-08-30%'
AND
    userIdentity.userName != 'HIDDEN_DUE_TO_SECURITY_REASONS'
```

The results reveal that the user **`pfisher`** had their credentials compromised, highlighting the need for immediate action.

### Retrieve the Flag
**Context:** 
The final step involves extracting the attacker's metadata, where the flag is concealed as a 32-character hexadecimal string within the User Agent.

**Query:**

```sql
SELECT
    userAgent, eventtime
FROM
    cloudtrail_logs_aws_cloudtrail_logs_104506445608_4e45885e
WHERE
    eventType='AwsConsoleSignIn'
AND
    REGEXP_LIKE(userAgent, '([0-9a-f]{32})')
```

Executing this query successfully reveals the hidden artifact.

## Hands-On Practice
To practice what you've learned:

1. **Set Up:** Make sure your AWS account has CloudTrail enabled and logs are being sent to S3.
2. **Query CloudTrail Logs:** Use AWS Athena to run the provided SQL queries, substituting your actual log table name.
3. **Analyze Results:** Look for patterns in failed login attempts and track down the user accounts involved.

### Common Troubleshooting Tips
- If you encounter permission errors, verify that your IAM user has the necessary privileges to access CloudTrail and Athena.
- Ensure that the log files in S3 are formatted correctly for Athena to query.

## Key Takeaways
Today, we learned how to utilize AWS CloudTrail and Athena to detect IAM breaches effectively. By recognizing the signs of malicious activity, identifying compromised credentials, and retrieving hidden artifacts, you are equipped with practical skills to enhance your cloud security posture.

## Real-World Applications
In production environments, the ability to monitor and analyze IAM activity is crucial. Organizations can implement automated alerts based on specific patterns derived from these queries, allowing for rapid response to potential security incidents. Establishing a culture of continuous monitoring and regular audits will help in maintaining robust security measures against evolving threats.

---
**Journey Progress:** 57/100 Days Complete 🚀