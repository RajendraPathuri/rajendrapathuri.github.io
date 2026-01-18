---
title: '100 Days of Cloud Security - Day 69: AWS CIRT WorkShop - Ransomware on S3 – Security Event Simulation and Detection - Part 1'
date: '2026-01-18'
author: 'Venkata Pathuri'
excerpt: 'Day 69 of my cloud security journey - AWS CIRT WorkShop - Ransomware on S3 – Security Event Simulation and Detection - Part 1'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 69: AWS CIRT WorkShop - Ransomware on S3 – Security Event Simulation and Detection - Part 1

## Overview
As we continue our journey through cloud security, today’s focus is on a critical aspect of data protection: responding to ransomware threats in AWS environments. Building on the foundational knowledge from Day 68, where we explored the importance of logging and monitoring, we’ll now delve into a hands-on simulation that mirrors real-world ransomware attacks on Amazon S3. This practical experience will equip you to better detect, investigate, and respond to security incidents.

## Learning Objectives
In today’s workshop, you will master the use of powerful tools such as Assisted Log Enabler and Security Analytics Bootstrap. You’ll learn how to simulate ransomware attacks using a bash script within AWS CloudShell, enabling you to investigate data destruction and exfiltration incidents. By the end of this session, you will be proficient in querying log data through Amazon Athena, utilizing AWS CloudTrail for event tracking, and leveraging CloudWatch metrics to uncover suspicious activities—all essential skills for any cloud security professional.

## Deep Dive
### Understanding Ransomware Attacks
Ransomware is a type of malicious software that encrypts files and demands payment for the decryption key. In cloud environments, such as AWS, attackers commonly target data stored in services like Amazon S3. Understanding how to detect and respond to these threats is crucial for maintaining data integrity and security.

### Tools and Techniques
1. **Assisted Log Enabler**: This open-source tool helps enable logging capabilities for AWS services, ensuring that all actions taken within your environment are recorded and can be analyzed later.
   
2. **Security Analytics Bootstrap**: This tool aids in setting up an analytics environment for processing and analyzing logs to identify potential security incidents.

### Simulation of Ransomware Attack
Within this workshop, participants will use a bash script to simulate malicious behavior, such as creating an S3 bucket and uploading a ransom note. This script will help visualize how attackers operate and the importance of monitoring for such activities.

### Example IAM User Query
To identify the IAM user responsible for creating the malicious S3 bucket, you can run the following SQL query in Amazon Athena:

```sql
SELECT eventtime, eventname, useridentity, sourceipaddress, useragent, requestparameters, responseelements 
FROM "irworkshopgluedatabase"."irworkshopgluetablecloudtrail" 
WHERE eventname = 'CreateBucket' 
AND requestparameters LIKE '%we-stole-ur-data-%'
```

**Expected Result**:
- **IAM User**: `tdir-workshop-rroe-dev`
- **Time**: _(Capture the `eventtime` from the results)_

### Investigating the Ransom Note Upload
To determine if the same IAM user uploaded the ransom note, execute this query:

```sql
SELECT eventtime, eventname, useridentity, sourceipaddress, useragent, requestparameters, responseelements 
FROM "irworkshopgluedatabase"."irworkshopgluetablecloudtrail" 
WHERE eventname = 'PutObject' 
AND requestparameters LIKE '%all_your_data_are_belong_to_us.txt%'
```

**Observation**: If no results are returned, this indicates that the initial IAM user did not upload the ransom note, which could point to further investigation.

## Hands-On Practice
### Step-by-Step Execution
1. **Open AWS CloudShell**: Launch your AWS CloudShell environment where you can run bash commands.
2. **Run the Simulation Script**: Use the provided bash script to initiate the ransomware simulation targeting the S3 resources.
3. **Query Logs with Athena**: After your simulation, run the SQL queries provided above to analyze the events recorded in CloudTrail.
4. **Review CloudWatch Metrics**: Access CloudWatch to check for any unusual activity that may have occurred during the simulation, such as spikes in data retrieval or deletion.

### Common Troubleshooting Tips
- If your queries return no results, double-check the bucket naming conventions in your script to ensure they match your queries.
- Ensure that CloudTrail logging is enabled for the account and the region you are working in, as this is critical for capturing the events.

## Key Takeaways
Today’s workshop emphasized the importance of proactive security measures against ransomware threats in AWS environments. By practicing with real-world scenarios, you now understand how to utilize AWS logging and monitoring tools effectively to detect and respond to suspicious activities. This experience not only enhances your technical skills but also prepares you for real-life incident response situations.

## Real-World Applications
In actual production environments, organizations can implement these practices to bolster their security posture. Regularly monitoring logs and employing tools like Amazon GuardDuty can help detect threats before they escalate. Understanding user behavior through logs can also aid in identifying compromised accounts, thereby mitigating risks associated with ransomware and other malicious activities.

---
**Journey Progress:** 69/100 Days Complete 🚀