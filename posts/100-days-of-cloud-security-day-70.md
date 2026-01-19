---
title: '100 Days of Cloud Security - Day 70: AWS CIRT WorkShop - Ransomware on S3 – Security Event Simulation and Detection - Part 2'
date: '2026-01-19'
author: 'Venkata Pathuri'
excerpt: 'Day 70 of my cloud security journey - AWS CIRT WorkShop - Ransomware on S3 – Security Event Simulation and Detection - Part 2'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 70: AWS CIRT WorkShop - Ransomware on S3 – Security Event Simulation and Detection - Part 2

## Overview
Welcome to Day 70 of our cloud security journey! Today, we continue our exploration of AWS security practices, focusing on simulating a ransomware attack on S3. Building upon our previous lessons, we will dive deeper into the tools available for detecting and responding to security incidents. This hands-on workshop will equip you with the skills to investigate unauthorized access and data manipulation, a crucial capability in today’s threat landscape.

## Learning Objectives
By the end of this session, you will have mastered several key capabilities: from performing Athena queries that expose indicators of compromise to analyzing CloudTrail events that reveal suspicious activities. You will learn how to leverage CloudWatch metrics for insights into data manipulation and utilize the AWS Billing service to uncover potential security breaches. Additionally, you will gain experience with Amazon GuardDuty to understand real-time threat detection in your S3 environments. This workshop is not just about theory; it's about preparing you for real-world challenges in cloud security.

## Deep Dive
In today's workshop, we will utilize open-source tools like _Assisted Log Enabler_ and _Security Analytics Bootstrap_ to set up our environment for simulating a ransomware attack. The simulation will involve executing a bash script in AWS CloudShell that mimics the behavior of a ransomware group targeting S3 buckets.

### Understanding the Tools
- **Assisted Log Enabler**: This tool helps in enabling the logs necessary for monitoring and analyzing security incidents, ensuring you have the visibility needed to respond effectively.
- **Security Analytics Bootstrap**: This tool provides a framework for analyzing logs and deriving actionable insights from security events.

### Simulating Ransomware Activity
The simulation starts with a straightforward bash script that will trigger a series of events, including the theft and deletion of sensitive data like `credit-card-data.csv`. As the script executes, it simulates actions typically associated with ransomware attacks, allowing you to observe the aftermath and learn how to respond.

### Investigating the Incident
You will use SQL queries with Amazon Athena to investigate the simulated ransomware attack:

1. **Identifying the Bucket and Object Location**
   ```sql
   SELECT * FROM "irworkshopgluedatabase"."irworkshopgluetablecloudtrail" where requestparameters like '%credit-card-data.csv%'
   ```
   This query will help you pinpoint where the `credit-card-data.csv` was stored.

2. **Confirming Object Theft**
   ```sql
   SELECT * FROM "irworkshopgluedatabase"."irworkshopgluetablecloudtrail" where eventname = 'GetObject' and requestparameters like '%credit-card-data.csv%'
   ```
   Here, you will check if the object was indeed accessed by the ransomware group, along with the timestamp of this event.

3. **Checking for Deletion**
   ```sql
   SELECT * FROM "irworkshopgluedatabase"."irworkshopgluetablecloudtrail" where eventname = 'DeleteObject' and requestparameters like '%credit-card-data.csv%'
   ```
   This query determines if the object has been deleted during the simulated attack.

4. **Identifying the Attacker's IP and User Agent**
   ```sql
   SELECT sourceipaddress, useragent FROM "irworkshopgluedatabase"."irworkshopgluetablecloudtrail" where eventname = 'DeleteObject' and requestparameters like '%credit-card-data.csv%'
   ```
   Understanding the attacker's profile can help in shaping your incident response.

5. **Analyzing IAM User Activity**
   ```sql
   SELECT useridentity.userName FROM "irworkshopgluedatabase"."irworkshopgluetablecloudtrail" where eventname = 'GetObject' and requestparameters like '%credit-card-data.csv%'
   ```
   This will reveal who accessed the sensitive files, which is critical for understanding the breach.

### CloudWatch Monitoring
To complement our investigation, we will also explore CloudWatch metrics. The specialized dashboard for DeleteRequests will provide insights into the volume of data deleted, helping you gauge the impact of the incident.

## Hands-On Practice
1. **Setting Up the Environment**: Launch AWS CloudShell and prepare the bash script for execution.
2. **Executing the Simulation**: Run the provided script to simulate ransomware activity.
3. **Running SQL Queries**: Use the SQL queries provided to gather data on the simulated breach.
4. **Analyzing CloudWatch**: Access the CloudWatch dashboard to review metrics and logs related to the incident.

### Expected Outcomes
After executing these steps, you should be able to retrieve comprehensive data on the simulated ransomware attack, giving you a solid foundation for real-world incident response.

### Common Troubleshooting Tips
- Ensure your IAM user has the necessary permissions to access CloudTrail and execute Athena queries.
- If your queries return no results, double-check the syntax and ensure that the logs are correctly configured and accessible.

## Key Takeaways
Today, we learned how to simulate and investigate a ransomware attack on an S3 bucket using AWS tools. By performing SQL queries on CloudTrail logs, we gained insights into unauthorized access and data manipulation. The ability to analyze CloudWatch metrics further enhances our understanding of the incident's impact. This hands-on experience is invaluable for any cloud security professional, preparing you to respond effectively to real-world threats.

## Real-World Applications
The skills and knowledge acquired in this workshop have significant implications for organizations leveraging AWS. Understanding how to monitor, detect, and respond to ransomware attacks is critical in protecting sensitive data and maintaining compliance. As cyber threats evolve, being equipped with practical experience in incident response will give you a competitive edge in the field of cloud security.

---
**Journey Progress:** 70/100 Days Complete 🚀