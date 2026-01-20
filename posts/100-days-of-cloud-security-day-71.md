---
title: '100 Days of Cloud Security - Day 71: Cryptominer Based Security Events - Simulation and Detection - Part 1'
date: '2026-01-20'
author: 'Venkata Pathuri'
excerpt: 'Day 71 of my cloud security journey - Cryptominer Based Security Events - Simulation and Detection - Part 1'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 71: Cryptominer Based Security Events - Simulation and Detection - Part 1

## Overview

Welcome back to Day 71 of our cloud security journey! Today, we'll take a deep dive into detecting and analyzing cryptomining activities within AWS environments. This builds on our Day 70 exploration of AWS security best practices, where we learned about the fundamental tools available in AWS for monitoring and securing your resources. By understanding how to identify cryptomining behavior, you will enhance your ability to safeguard your cloud infrastructure against unauthorized and potentially damaging activities.

## Learning Objectives

In this workshop, you will master a variety of essential skills that are crucial for responding to security events. You'll learn how to utilize AWS CloudFormation to set up necessary resources and then leverage Amazon Athena to query logs for indicators of compromise. Additionally, you'll gain insights into Amazon GuardDuty findings, AWS CloudTrail events, and how to analyze Amazon Route 53 DNS Resolver Query logs and VPC Flow logs. By the end of this session, you will be equipped with practical skills to detect and investigate cryptomining activities effectively.

## Deep Dive

### Understanding Cryptomining and Its Threats

Cryptomining involves the use of computational resources to validate cryptocurrency transactions, often leading to unauthorized use of computing power in cloud environments. Attackers exploit cloud resources to mine cryptocurrencies, causing significant financial impact through increased costs and degraded performance of legitimate applications. 

To combat this threat, we will utilize various AWS services to monitor and analyze activity indicative of cryptomining. This includes querying logs from CloudTrail, Route 53, and VPC Flow logs to identify unusual patterns and behaviors.

### Key AWS Services

1. **AWS CloudTrail**: This service tracks user activity and API usage across your AWS infrastructure. It acts as a critical component for auditing and compliance.

2. **Amazon Athena**: A serverless interactive query service that makes it easy to analyze data in Amazon S3 using standard SQL. It will be instrumental in analyzing our log data.

3. **Amazon GuardDuty**: A threat detection service that continuously monitors for malicious activity and unauthorized behavior. It provides findings related to potential security events.

4. **Amazon Route 53**: This scalable DNS web service allows us to monitor DNS queries, helping us identify unexpected domain resolutions that may indicate cryptomining activity.

### Example Scenario

Imagine you notice an unusual spike in your AWS bill. Upon investigation, you discover that two EC2 instances were launched outside of your normal operating patterns. Your task is to uncover the details of these instances and analyze their behavior to determine if they are engaged in cryptomining.

## Hands-On Practice

### Step 1: Create Cloud Resources

Use AWS CloudFormation to set up your lab environment. Ensure logging is enabled for CloudTrail, VPC Flow logs, and Route 53 Resolver Query logs.

### Step 2: Querying CloudTrail Logs

To identify the Instance IDs of the EC2 instances created during the simulation, run the following SQL query in Amazon Athena:

```sql
SELECT * FROM "irworkshopgluedatabase"."irworkshopgluetablecloudtrail" WHERE eventname = 'RunInstances';
```

### Step 3: Checking Instance Types

To check the instance types of the launched EC2 instances, execute the following AWS CLI command:

```bash
aws ec2 describe-instances --filters Name=tag:tdir-workshop,Values=test-servers --query 'Reservations[*].Instances[*].InstanceType' --output text
```

### Step 4: Analyzing API Calls

Next, identify any APIs called by the EC2 instance credentials:

```sql
SELECT eventname as COUNT
FROM "irworkshopgluedatabase"."irworkshopgluetablecloudtrail"
WHERE eventsource = 'ec2.amazonaws.com' AND
(date_partition >= '<enter one month before current date YYYY/MM/DD>' AND
date_partition <= '<enter current date YYYY/MM/DD>')
AND
(
requestparameters LIKE '%<instance-id>%' OR
requestparameters LIKE '%<instance-id>%'
);
```

Replace `<enter one month before current date YYYY/MM/DD>` and `<enter current date YYYY/MM/DD>` with the appropriate dates.

### Step 5: Checking Resolver Query Logs

To find the top requested domain, utilize the following SQL query:

```sql
SELECT "irworkshopgluedatabase"."irworkshopgluetabledns".query_name,
"irworkshopgluedatabase"."irworkshopgluetabledns".query_type,
"irworkshopgluedatabase"."irworkshopgluetabledns".srcaddr,
"irworkshopgluedatabase"."irworkshopgluetabledns".srcids,
count(*) as count
FROM "irworkshopgluedatabase"."irworkshopgluetabledns"
WHERE query_name NOT LIKE '%amazonaws.com%'
AND query_name NOT LIKE '%ec2.internal%'
GROUP BY "irworkshopgluedatabase"."irworkshopgluetabledns".query_name, "irworkshopgluedatabase"."irworkshopgluetabledns".query_type, "irworkshopgluedatabase"."irworkshopgluetabledns".srcaddr, "irworkshopgluedatabase"."irworkshopgluetabledns".srcids
ORDER BY count DESC;
```

### Common Pitfalls

- Ensure you have the correct IAM permissions to execute the commands.
- Double-check the format of your SQL queries; small syntax errors can lead to failures.
- Use the correct date ranges in your queries to avoid missing relevant data.

## Key Takeaways

Today’s workshop equipped you with critical skills to identify and analyze cryptomining activities in AWS environments. By leveraging AWS services like CloudTrail and Athena, you can monitor your infrastructure for unauthorized usage. Recognizing the signs of cryptomining not only enhances security but also protects your cloud investment.

## Real-World Applications

In production environments, being vigilant about cryptomining activities can save organizations from unexpected costs and resource depletion. Regularly monitoring logs, employing automated tools like GuardDuty, and responding swiftly to unusual patterns can significantly mitigate risks associated with cryptomining.

---
**Journey Progress:** 71/100 Days Complete 🚀