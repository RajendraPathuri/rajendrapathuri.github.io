---
title: '100 Days of Cloud Security - Day 68: AWS CIRT WorkShop - Unauthorized IAM Credential Use – Security Event Simulation and Detection'
date: '2026-01-17'
author: 'Venkata Pathuri'
excerpt: 'Day 68 of my cloud security journey - AWS CIRT WorkShop - Unauthorized IAM Credential Use – Security Event Simulation and Detection'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 68: AWS CIRT WorkShop - Unauthorized IAM Credential Use – Security Event Simulation and Detection

## Overview
Welcome to Day 68 of our cloud security journey! Today, we're diving into an essential workshop designed by AWS to help us understand the threat landscape associated with unauthorized IAM credential use. Building on our previous discussions about IAM best practices and security posture, this hands-on experience will equip you with the skills to identify, analyze, and respond to potential security incidents in AWS environments.

## Learning Objectives
In this workshop, you will master the art of detecting and analyzing unauthorized IAM credential use, providing you with the tools to safeguard your cloud resources. By the end of our session, you will have:

- Leveraged AWS CloudFormation to create essential cloud resources.
- Executed Amazon Athena queries to investigate log data and identify indicators of compromise.
- Gained insights into AWS CloudTrail events to enhance your incident response capabilities.
- Utilized AWS CloudShell to run bash scripts and AWS CLI commands effectively.
- Walked through critical containment strategies for security incidents involving IAM credential misuse.

## Deep Dive
### Investigating Access Key IDs - Part 1
In our first investigation, we aim to identify the initial point of compromise associated with leaked IAM credentials. Attackers often begin their malicious activities by executing the `GetCallerIdentity` API call, which helps them ascertain their identity and the privileges they possess. 

To find out when the exposed IAM Access Key ID was first used, we can run the following SQL query in Amazon Athena:

```sql
SELECT eventtime, eventname 
FROM irworkshopgluetablecloudtrail 
WHERE useridentity.accesskeyid = 'AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours' 
ORDER BY eventtime ASC 
LIMIT 1;
```

This query reveals that the key was first used on `2026-01-07T02:25:18Z` with the `GetCallerIdentity` event. Recognizing such patterns is crucial for security teams, as it often indicates the start of an attack.

Next, we need to identify the very first API called by the compromised Access Key ID:

```sql
SELECT eventtime, eventname 
FROM irworkshopgluetablecloudtrail 
WHERE useridentity.accesskeyid = 'AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours' 
ORDER BY eventtime ASC;
```

Moreover, understanding the identity of the IAM user associated with the compromised Access Keys is pivotal. By querying the `useridentity` object, we can uncover the user as `tdir-workshop-sysdev`, which corresponds to Access Key: `AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours`.

### Investigating Access Key IDs - Part 2
Now that we have identified the initial access point, we move on to assess the persistence of the attack. We can determine what resources were created with the newly discovered user by executing:

```sql
SELECT eventname 
FROM irworkshopgluetablecloudtrail 
WHERE useridentity.accesskeyid = 'AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours';
```

Additionally, we can filter for the `CreateAccessKey` event to find out which new users were created:

```sql
SELECT requestparameters 
FROM irworkshopgluetablecloudtrail 
WHERE useridentity.userName = 'tdir-workshop-sysdev' 
AND eventname = 'CreateAccessKey';
```

The data reveals two new users: 
- Username: `tdir-workshop-mmajor-dev` | Access Key ID: `AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours`
- Username: `tdir-workshop-nwolf-dev` | Access Key ID: `AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours`

### Investigating Access Key IDs - Part 3
In the final part of our investigation, we will analyze lateral movement and impact. First, we can check what actions were taken with the `mmajor-dev` key:

```sql
SELECT eventname 
FROM irworkshopgluetablecloudtrail 
WHERE useridentity.accesskeyid = 'AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours';
```

Finding zero events suggests that this key might have been created as a backup or could be a "sleeper" key that hasn't been activated yet. Conversely, we check for actions taken with the `nwolf-dev` key:

```sql
SELECT eventname 
FROM irworkshopgluetablecloudtrail 
WHERE useridentity.accesskeyid = 'AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours';
```

This key shows five active events, indicating its use for further actions, including the pivotal `DeleteUser` event:

```sql
SELECT requestparameters, useridentity.username 
FROM irworkshopgluetablecloudtrail 
WHERE useridentity.accesskeyid = 'AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours' 
AND eventname = 'DeleteUser';
```

## Hands-On Practice
To solidify your understanding, follow these practical steps in your AWS environment:

1. **Set Up the Environment**: Use AWS CloudFormation to deploy the necessary resources for the workshop.
2. **Run the Queries**: Use the AWS CloudShell to execute the provided SQL commands to analyze CloudTrail logs.
3. **Verify Your Outcomes**: Ensure that the event times and user actions align with the expected results. Look for discrepancies that might indicate unauthorized actions.
4. **Common Troubleshooting**: If you encounter issues, check your IAM permissions to ensure you have access to the CloudTrail logs and Athena.

### Note on Credentials
Make sure to replace any instance of access keys with example credentials such as `AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours` (with "EXAMPLE" clearly visible) to avoid the use of real credentials.

## Key Takeaways
Through this workshop, you have gained invaluable skills in detecting and analyzing unauthorized IAM credential use. Understanding the sequence of API calls and user actions empowers you to respond effectively to security incidents. Remember, proactive monitoring and logging are your best defenses against these types of threats.

## Real-World Applications
Organizations today face constant threats from unauthorized access to their cloud environments. By mastering the techniques learned in this workshop, you can implement robust monitoring strategies, ensuring that any suspicious activity is swiftly identified and mitigated. This knowledge is crucial not just for compliance, but for maintaining the integrity and security of your cloud infrastructure.

---
**Journey Progress:** 68/100 Days Complete 🚀