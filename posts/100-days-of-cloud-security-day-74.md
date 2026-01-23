---
title: '100 Days of Cloud Security - Day 74: SSRF on IMDSv1 - Simulation and Detection - Part 2'
date: '2026-01-23'
author: 'Venkata Pathuri'
excerpt: 'Day 74 of my cloud security journey - SSRF on IMDSv1 - Simulation and Detection - Part 2'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 74: SSRF on IMDSv1 - Simulation and Detection - Part 2

## Overview

Welcome back to Day 74 of our journey! Today, we build upon the foundational knowledge of Server-Side Request Forgery (SSRF) vulnerabilities, specifically focusing on the Instance Metadata Service Version 1 (IMDSv1). In our previous session, we explored how SSRF can lead to unauthorized data access and manipulation. Now, we will dive deeper into the detection and investigation aspects, equipping you with practical skills and tools to respond effectively to such vulnerabilities in AWS environments.

## Learning Objectives

By the end of this workshop, you will master the techniques to detect and respond to SSRF vulnerabilities within your AWS infrastructure. You will learn how to perform detailed log analysis using Amazon Athena and CloudWatch Logs Insights, identify unauthorized activities through CloudTrail events, and utilize AWS services such as SSM and AWS WAF to reinforce your security posture. This hands-on experience will empower you to proactively manage and mitigate SSRF risks.

## Deep Dive

### Understanding SSRF and IMDSv1

Server-Side Request Forgery (SSRF) is a vulnerability that allows an attacker to send requests from a vulnerable server to internal resources, potentially exposing sensitive data. The Instance Metadata Service (IMDS) provides crucial metadata about EC2 instances, including IAM roles and associated credentials. In IMDSv1, this information is accessed through the IP address `169.254.169.254`, making it particularly important to secure this endpoint.

### Log Analysis: Identifying Compromise

To determine if an EC2 instance has been compromised via SSRF, we need to analyze application logs for requests made to the IMDS endpoint. Using CloudWatch Logs Insights, you can run the following command to filter relevant logs:

```plaintext
fields @timestamp, @message 
| filter query like "169.254.169.254" 
| sort @timestamp desc
```

In this query, you will see details like the **Instance ID**, the request made, and the **User Agent**. For instance, you might find a log entry like this:

```
GET /?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/role-name
```

This indicates that an attacker has successfully accessed sensitive IAM role information.

### Using Athena for ELB Log Analysis

Since our application is behind an Elastic Load Balancer (ELB), we can utilize Amazon Athena to query ELB logs for any requests targeting the IMDS endpoint:

```sql
SELECT * FROM irworkshopgluetablealb 
WHERE request_url LIKE '%169.254.169.254%';
```

This helps us confirm whether the SSRF attack was successful and provides insights into the attack vector.

### Investigating User Creation with Compromised Credentials

Once we've identified the potential compromise, we can further analyze CloudTrail logs to look for unauthorized actions, such as user creation attempts using the compromised credentials. A typical query might look like this:

```sql
SELECT * FROM irworkshopgluetablecloudtrail 
WHERE responseelements LIKE '%i-00f%';
```

Here, you can refine your search by adding filters for specific parameters like `requestParameters` to identify attempts to create a user, such as `adm1n`. 

## Hands-On Practice

1. **Set Up Your Environment**: Ensure the AWS CLI is installed. You can follow the [installation guide here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

2. **Run CloudWatch Insights Command**: Execute the command to filter for requests targeting the IMDS:

   ```plaintext
   aws logs start-query --log-group-name <YourLogGroupName> --start-time <StartTime> --end-time <EndTime> --query-string 'fields @timestamp, @message | filter query like "169.254.169.254" | sort @timestamp desc'
   ```

   Replace `<YourLogGroupName>`, `<StartTime>`, and `<EndTime>` with your relevant parameters.

3. **Analyze ELB Logs with Athena**:
   Run the Athena query to check for any requests that target the metadata service.

4. **Check CloudTrail for Unauthorized User Creation**:
   Use the provided SQL query to identify unauthorized user creation attempts.

### Troubleshooting Tips

- If your queries return no results, double-check your time range and log group names.
- Ensure that your IAM role has the necessary permissions to read the logs from CloudWatch and execute queries in Athena.
- Always monitor for unusual spikes in traffic to the IMDS endpoint as a potential indicator of compromise.

## Key Takeaways

In this session, we have reinforced the importance of understanding SSRF vulnerabilities, particularly in the context of the AWS environment. By mastering log analysis techniques and leveraging AWS tools like CloudWatch, Athena, and CloudTrail, you are now equipped to detect and respond to unauthorized activities effectively. Remember, proactive monitoring and quick response are key to maintaining a secure cloud infrastructure.

## Real-World Applications

In real-world scenarios, organizations often face SSRF risks due to misconfigured applications or services that expose internal resources. By implementing robust logging, monitoring, and access controls, you can significantly reduce the attack surface. As you advance in your cloud security journey, consider regularly reviewing and updating your security policies and practices to stay ahead of emerging threats.

---
**Journey Progress:** 74/100 Days Complete 🚀