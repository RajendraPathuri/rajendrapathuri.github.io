---
title: '100 Days of Cloud Security - Day 72: Cryptominer Based Security Events - Simulation and Detection - Part 2'
date: '2026-01-21'
author: 'Venkata Pathuri'
excerpt: 'Day 72 of my cloud security journey - Cryptominer Based Security Events - Simulation and Detection - Part 2'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 72: Cryptominer Based Security Events - Simulation and Detection - Part 2

## Overview
Welcome back to Day 72 of our cloud security journey! Today, we delve deeper into the realm of detecting cryptominer-based security events within AWS environments. Building on the knowledge from Day 71, where we established foundational understanding of cloud security logs, we will leverage AWS tools to identify and analyze suspicious activities related to cryptomining. This hands-on workshop will empower you with practical skills that are essential for any cloud security professional.

## Learning Objectives
By the end of this session, you will have mastered several critical skills, including utilizing AWS CloudFormation to deploy necessary resources, executing Amazon Athena queries to sift through log data, and analyzing findings from Amazon GuardDuty. Additionally, you'll gain insights into Amazon VPC Flow logs and how they can reveal unauthorized network activities. This comprehensive exercise is designed to enhance your analytical capabilities and response strategies when dealing with cryptomining threats in the cloud.

## Deep Dive
Cryptomining in the cloud can be a lucrative venture for malicious actors, often leading to significant financial losses and operational disruptions. As cloud security professionals, understanding how to detect such activities is crucial.

### Amazon VPC Flow Logs
VPC Flow logs provide detailed records of the IP traffic going to and from network interfaces in your VPC. This data is essential for identifying unusual traffic patterns, such as those associated with cryptomining. For example, a spike in traffic to specific IP addresses can indicate unauthorized mining operations.

When querying VPC Flow logs, you can filter out internal traffic to focus on external sources. Consider the following SQL query to find the source IP address with the highest packet count, excluding internal AWS traffic:

```sql
SELECT numpackets, sourceaddress, destinationaddress, destinationport
FROM "irworkshopgluedatabase"."irworkshopgluetablevpcflow"
WHERE flow_direction = 'egress' AND
destinationaddress NOT LIKE '192.168.%' AND
destinationaddress NOT LIKE '10.%' AND
destinationaddress NOT LIKE '172.%'
GROUP BY numpackets, sourceaddress, destinationaddress, destinationport
ORDER BY numpackets DESC
```

### Amazon GuardDuty
GuardDuty is an intelligent threat detection service that continuously monitors for malicious activity and unauthorized behavior. It provides findings that can help you quickly respond to potential threats. In our workshop, we will explore findings triggered by cryptomining resource creation, such as:

1. **CryptoCurrency:EC2/BitcoinTool.B!DNS**
2. **Trojan:EC2/DNSDataExfiltration**

These findings will often highlight the EC2 instance IDs involved, which you can extract using a simple bash script. The Action type triggering these alerts is typically a DNS_REQUEST, and the network protocol involved is usually UDP.

### Practical Tips
- Regularly review GuardDuty findings and set up alerts for specific threats to ensure timely responses.
- Use Amazon Athena for querying logs to identify trends over time, which can help in proactive security measures.
- Always validate the source of the findings against reputable threat intelligence sources, such as ProofPoint and Amazon's Threat IP list.

## Hands-On Practice
1. **Set Up Resources**: Start by using AWS CloudFormation to deploy the necessary resources. You can use sample templates to streamline this process.
2. **Querying Logs**: Access Amazon Athena and run the provided SQL queries to analyze your VPC Flow logs and GuardDuty findings.
3. **Evaluate Findings**: Review the GuardDuty findings for cryptomining and take note of the EC2 instance IDs and triggered actions.
4. **Run Bash Scripts**: Use AWS CloudShell to execute bash scripts that can help automate the extraction of EC2 instance IDs from the findings.

For example, consider the following command structure (replace with your actual credentials):

```bash
aws guardduty list-findings --detector-id <detector-id> --query 'Findings[*].{ID: Id}' --region us-east-1
# Replace with your actual credentials
export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours
export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

### Common Troubleshooting Tips
- Ensure your IAM role has the necessary permissions to access GuardDuty and VPC Flow logs.
- If queries return no results, verify the time range of your query and ensure that logs are being generated correctly.

## Key Takeaways
Today’s exploration has equipped you with invaluable skills for detecting and analyzing cryptomining activities in AWS environments. By leveraging tools like Amazon Athena and GuardDuty, you can gain critical insights into potential security threats and take proactive measures to protect your cloud resources.

## Real-World Applications
In production environments, the ability to detect cryptomining activities is essential for maintaining operational integrity and security. Organizations must regularly monitor their cloud environments for unauthorized use of resources, ensuring that their cloud infrastructure remains secure and cost-effective. By implementing the techniques learned today, you will be better prepared to safeguard your organization against the growing threat of cryptomining and other similar attacks.

---
**Journey Progress:** 72/100 Days Complete 🚀