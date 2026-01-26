---
title: '100 Days of Cloud Security - Day 77: Wiz - The Cloud Hunting Games'
date: '2026-01-26'
author: 'Venkata Pathuri'
excerpt: 'Day 77 of my cloud security journey - Wiz - The Cloud Hunting Games'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 77: Wiz - The Cloud Hunting Games

## Overview
Today, we step into an exhilarating scenario where we become the defenders of ExfilCola, a startup on the brink of losing its proprietary soda formula to a nefarious group known as "FizzShadows." This exercise reinforces the importance of monitoring and analyzing cloud activities, a skill we began honing in Day 76, where we dug into incident response strategies. In this interactive challenge, we will showcase our ability to investigate security incidents and take decisive action to protect valuable assets.

## Learning Objectives
By engaging with the Cloud Hunting Games today, you will sharpen your investigative skills in cloud security. You will learn how to analyze AWS CloudTrail and S3 logs to trace unauthorized access, identify compromised IAM roles, and uncover the methods attackers use to infiltrate systems. Ultimately, you'll gain hands-on experience in mitigating threats and preserving sensitive information, solidifying your understanding of cloud security best practices.

## Deep Dive
In the scenario presented, **ExfilCola** faces a critical threat from the "FizzShadows." Our first task is to validate their claim of exfiltrating secret recipes stored within a secured S3 bucket. Thanks to the foresight of the security team, we have access to S3 data event logs, which serve as a valuable resource for our investigation.

### Identifying Data Exfiltration
To determine if there was indeed a data breach, we analyze the S3 logs by executing the following SQL query:

```sql
SELECT userIdentity_ARN, BytesOut, COUNT(*)
FROM s3_data_events
GROUP BY BytesOut
ORDER BY BytesOut DESC
```

This query allows us to identify high-volume data transfers. If we discover a suspicious IAM role involved, we can further investigate.

Upon executing the query, we find the following role linked to the breach: 
`arn:aws:sts::509843726190:assumed-role/S3Reader/drinks`. 

Next, we verify this role's activity using:

```sql
SELECT *, COUNT(*)
FROM s3_data_events
GROUP BY BytesOut
ORDER BY BytesOut DESC
```

This will provide detailed logs for the identified role to see the specific actions taken.

### Tracing the Compromised User
Next, we turn our attention to the IAM user who assumed the compromised role. Using CloudTrail logs, we can track down the user responsible:

```sql
SELECT * FROM cloudtrail
WHERE requestParameters LIKE '%S3Reader%'
GROUP BY userIdentity_userName
```

Here, we identify **Moe.Jito** as the compromised user. Understanding how they accessed the system is critical for preventing future breaches.

### Uncovering the Attack Vector
With the compromised user in sight, we dig deeper into the CloudTrail logs to find the machine leveraged for lateral movement. We can group events by `EventName` to find unique actions taken by the attacker:

```sql
SELECT * FROM cloudtrail
GROUP BY EventName
```

This investigation reveals a unique event related to the Lambda function, leading us to the instance ID `i-0a44002eec2f16c25`, which was compromised and used for further attacks.

### Finding the Initial Entry Point
Upon gaining root access to the compromised EC2 machine, we check for logs in the `/var/log` directory. If logs are missing, attackers may have attempted to hide their tracks. A common tactic is to mount a temporary filesystem over the logging directory. By unmounting it, we might reveal hidden logs:

```bash
umount /var/log
```

After unmounting, we discover the `auth.log`, indicating SSH access to the instance from IP `102.54.197.238` as the `postgresql` user. This IP is crucial in tracing back to the initial entry point of the attack.

### Mitigating the Threat
With the attacker’s persistence evident through their cron job, we need to act decisively. The job runs a base64 encoded script, which, when decoded, reveals the attacker's methods and the command-and-control server URL.

We can employ the following command to delete the stolen recipe from the attacker's server:

```bash
curl -u "FizzShadows_1:Gx27pQwz92Rk" -X DELETE "http://34.118.239.100/files/ExfilCola-Top-Secret.txt"
```

Executing this command successfully removes the threat, ensuring the secret recipe remains confidential.

## Hands-On Practice
Let’s put our learning into action:

1. **Identify High Data Egress:**
   - Run the SQL query on your S3 logs to find suspicious IAM roles involved in data exfiltration.
   
2. **Trace the Compromised User:**
   - Use CloudTrail logs to identify which user assumed the compromised IAM role.

3. **Investigate the Attack Vector:**
   - Analyze event names in CloudTrail to pinpoint the compromised machine.

4. **Recover Missing Logs:**
   - Use the `umount` command to reveal hidden logs, and inspect for unauthorized access.

5. **Delete the Stolen File:**
   - Use the `curl` command to delete the stolen secret recipe from the attacker's server.

**Common Pitfalls to Avoid:**
- Always validate your SQL queries to ensure you are querying the correct logs.
- Be cautious with command execution on compromised machines; ensure you follow proper security protocols.

## Key Takeaways
Today’s challenge illustrates the importance of proactive monitoring and incident response in cloud environments. By understanding how to trace unauthorized access through IAM roles and CloudTrail logs, we can effectively mitigate threats before they escalate. This exercise not only enhances our investigative skills but also emphasizes the need for robust logging and monitoring systems in place to safeguard sensitive data.

## Real-World Applications
In real-world scenarios, organizations face similar threats on a daily basis. By implementing thorough logging practices and continuous monitoring of IAM roles, companies can swiftly detect and respond to security incidents. Regularly auditing access logs and employing automated tools for anomaly detection can significantly enhance an organization's security posture, safeguarding valuable intellectual property against potential threats.

---
**Journey Progress:** 77/100 Days Complete 🚀