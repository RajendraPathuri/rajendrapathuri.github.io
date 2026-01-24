---
title: '100 Days of Cloud Security - Day 75: SSRF on IMDSv1 - Simulation and Detection - Part 3'
date: '2026-01-24'
author: 'Venkata Pathuri'
excerpt: 'Day 75 of my cloud security journey - SSRF on IMDSv1 - Simulation and Detection - Part 3'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 75: SSRF on IMDSv1 - Simulation and Detection - Part 3

## Overview
Welcome back to Day 75 of our cloud security journey! In previous days, we've explored various facets of AWS security, including how to detect unauthorized activities. Today, we take a closer look at Server Side Request Forgery (SSRF) vulnerabilities specifically in the context of the Instance Metadata Service Version 1 (IMDSv1). By the end of this workshop, you'll not only understand how to simulate an SSRF attack but also how to effectively detect and respond to such threats, building upon the detection techniques we discussed yesterday.

## Learning Objectives
Throughout this workshop, you will master the art of detecting resource creation via CloudFormation, identifying unauthorized console logins, and uncovering Remote Code Execution (RCE) activities that may arise from compromised credentials. You will gain hands-on experience with tools like Amazon GuardDuty and CloudTrail, enabling you to respond to security events effectively. By engaging with real-world scenarios, you’ll be equipped to apply these skills in your AWS environments.

## Deep Dive
### Detection of Resource Creation Using CloudFormation
As we dive into the detection of unauthorized resource creation, we will specifically monitor AWS CloudFormation stack creation events. To locate these events, you can use the following SQL query on your CloudTrail logs:

```sql
select * from irworkshopgluetablecloudtrail
where eventname = 'CreateStack';
```

When you execute this command, you may find that the `webdev` user attempted to create a stack but received an `AccessDenied` error. This indicates that while the user tried to perform an action, they lacked the necessary permissions, which is a common sign of a potential security issue.

To narrow down your search further, you can filter by the specific instance ID associated with the user:

```sql
select * from irworkshopgluetablecloudtrail
where eventname = 'CreateStack' and useridentity.principalid like '%i-%';
```

### Detection of Console Login With Compromised Credentials
Next, we need to examine console login attempts. To find these events, we will look for log entries with the event source of **'signin.amazonaws.com'** and the event name **'ConsoleLogin'**.

```sql
select * from irworkshopgluetablecloudtrail
where eventname = 'ConsoleLogin' and useridentity.principalid like '%i-%';
```

In the results, check the `responseElements` field. If it shows `ConsoleLogin: Success`, it confirms that the login was successful, which could indicate unauthorized access.

### Detection of Remote Code Execution Using Compromised Credentials
To investigate potential Remote Code Execution, our first approach will be to utilize **Amazon GuardDuty**. This service efficiently highlights security findings, providing critical details such as who made the request and when it occurred.

Alternatively, if you prefer to analyze CloudTrail logs, you can filter for the `SendCommand` event associated with AWS Systems Manager:

```sql
SELECT * from "irworkshopgluedatabase"."irworkshopgluetablecloudtrail" WHERE eventname = 'SendCommand' and useridentity.principalid like '%i-%';
```

From the results, look for a `SendCommand` request. If you see that the command `whoami` was executed, you can further investigate by retrieving the command output using its `CommandId`:

```cli
aws ssm list-commands --command-id "83a2c4fa-c9c9-478a-8f19-739bfece8f2a" --details
```
*# Remember to replace the CommandId with the actual ID from your logs.*

### Bonus Section: Web Application Firewall (WAF)
Once your web application is operational, implementing a Web Application Firewall (WAF) is essential to restrict unauthorized access. Here are some practices you can adopt:

**1. IP Restriction:** Create an IP Set and configure a Web ACL to filter traffic based on IP addresses. This is a critical step to limit access to only trusted sources.

**2. Blocking Malicious Query Parameters:** To protect against SSRF by blocking access to the Instance Metadata Service, use the Rule Builder in your Web ACL. Set a condition to block requests containing `"169.254.169.254"`.

**3. User-Agent Restriction:** Limit access based on the User-Agent header to ensure your application is accessed only through specified browsers. For instance, to allow access only via Chrome, you can set up a rule to block all other User-Agents.

## Hands-On Practice
To put your knowledge into practice, follow these steps:

1. **Detect Resource Creation:**
   - Run the SQL queries provided to check for stack creation attempts.
   - Analyze logs for `AccessDenied` errors.

2. **Monitor Console Logins:**
   - Execute the SQL query for ConsoleLogin events.
   - Verify if there are any successful logins by checking the `responseElements`.

3. **Check for RCE:**
   - Use Amazon GuardDuty to spot any suspicious activities.
   - If using CloudTrail, filter logs for `SendCommand` events.

4. **Implement WAF:**
   - Create an IP Set and configure your Web ACL to restrict access.
   - Set up rules to block SSRF attempts and enforce User-Agent restrictions.

Expected outcomes include a clear understanding of unauthorized access patterns and enhanced security configurations in your AWS environment.

## Key Takeaways
Today’s exploration into SSRF vulnerabilities and their detection methods equips you with crucial skills for identifying unauthorized activities in AWS. From monitoring CloudFormation events to leveraging GuardDuty for RCE detection, these strategies will empower you to enhance your security posture. Implementing WAF rules further protects your applications from potential exploits, ensuring a proactive defense against common attack vectors.

## Real-World Applications
Understanding SSRF vulnerabilities and detection techniques is imperative for securing cloud environments. Companies often face challenges related to unauthorized access and configuration errors that can lead to severe breaches. By applying the methodologies discussed today, security professionals can fortify their AWS infrastructures, safeguarding sensitive data and maintaining compliance with security policies.

---

**Journey Progress:** 75/100 Days Complete 🚀