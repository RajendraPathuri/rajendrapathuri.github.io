---
title: '100 Days of Cloud Security - Day 53: Attack - detection_evasion - Part 2'
date: '2026-01-01'
author: 'Venkata Pathuri'
excerpt: 'Day 53 of my cloud security journey - Attack - detection_evasion - Part 2'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 53: Attack - detection_evasion - Part 2

## Overview
Welcome to Day 53 of our cloud security journey! Today, we continue our exploration of attack detection evasion strategies, focusing on accessing secrets stored in AWS Secrets Manager while evading detection mechanisms. Building on the foundational concepts from Day 52, we will delve deeper into the intricacies of bypassing security measures like CloudTrail and CloudWatch. This session will empower you to understand the tactics employed by attackers and the corresponding defensive strategies necessary to safeguard your cloud environment.

## Learning Objectives
By the end of this session, you will master the techniques to hide your actions from AWS's detection systems while accessing sensitive information. You will learn how to analyze detection filters, navigate connectivity constraints, and utilize AWS's VPC endpoints to mask your activities. This knowledge will enhance your understanding of both offensive and defensive security measures in the cloud, providing you with a holistic view of the cloud security landscape.

## Deep Dive

### Analyzing Detection Filters
Understanding how AWS logs your requests is crucial for any cloud security professional. We began by analyzing the detection filters set up in CloudWatch for our specific log group. The command below retrieves the metric filters that help identify anomalous activities:

```bash
aws logs describe-metric-filters --log-group-name cg_detection_evasion_logs
```

The filter pattern reveals that access is permitted from specific IP addresses associated with IAM users. For instance, the "easy path" is associated with the IP `54.159.157.137`, while the "hard path" uses `3.84.104.128`. Knowing this helps to strategize our next steps effectively.

### Connecting to the Hard Path Instance
Upon connecting to our hard path instance, we used AWS Systems Manager Session Manager for a seamless connection without needing SSH:

```bash
aws ssm start-session --target i-0e17e3efc92cec1f6 --profile cg-4
```

However, we encountered an issue: the instance lacked internet connectivity, making it impossible to interact with AWS APIs directly. This limitation forced us to explore alternative ways to access the required resources.

### Retrieving Instance Credentials
To bypass the internet connectivity issue, we leveraged the Instance Metadata Service to fetch temporary security credentials:

```bash
curl http://169.254.169.254/latest/meta-data/iam/security-credentials/cgidtnxnoeqpeo_hard
```

The output provided vital information, including the Access Key ID, Secret Access Key, and session token. Remember, in a real-world scenario, you would never share or expose actual credentials. Always use example formats like:

```json
{
  "AccessKeyId": "ASIA6QRD2LZQ...EXAMPLE",
  "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  "Token": "IQoJb3JpZ2luX2VjECoaC...",
  "Expiration": "2025-12-01T07:52:51Z"
}
```

### AWS Source IP Obfuscation via VPC Endpoints
The next step in our attack chain involves using AWS VPC endpoints to obfuscate our source IP. This technique allows attackers to route traffic privately, logging a private IP instead of a public one in AWS CloudTrail. Here’s a step-by-step breakdown:

| Step | Action | Why it matters |
|------|--------|----------------|
| 1. **Create VPC** | Choose a specific IP range (CIDR) that mimics the production environment. | This enables us to conceal our true location. |
| 2. **Launch EC2** | Deploy an EC2 instance with a matching private IP. | This allows API calls to appear as if they originated from the target's network. |
| 3. **Create VPC Endpoint** | Configure the endpoint to allow access to specific resources. | Ensures that requests are routed privately. |
| 4. **Configure Credentials** | Load the stolen credentials onto the EC2 instance. | This is crucial for executing authorized actions. |
| 5. **Attack** | Run commands to access sensitive data. | The victim's logs will display our fabricated private IP. |

### Listing Secrets
With our infrastructure in place, we can now list the secrets we aim to access:

```bash
aws secretsmanager list-secrets --region us-east-1
```

This command returns a list of secrets, including their ARN, name, and description. It’s crucial to maintain awareness of which secrets contain sensitive information that could be exploited.

### Retrieving Secret Value
Finally, we can retrieve the secret value securely:

```bash
aws secretsmanager get-secret-value --secret-id cgidtnxnoeqpeo_hard_secret --region us-east-1
```

The expected output reveals the secret string, which could be valuable in a real-world attack scenario:

```json
{
  "SecretString": "cg-secret-012337-194329"
}
```

## Hands-On Practice
To put these concepts into practice, follow these steps:

1. **Setup your AWS environment** ensuring you have the right permissions to access Secrets Manager and create VPCs.
2. **Run the commands listed above** to analyze detection filters, connect to your instance, and retrieve instance credentials.
3. **Create a VPC and EC2 instance** as described, ensuring the IP configuration matches the expected logs.
4. **Use AWS Secrets Manager commands** to list and retrieve secrets, observing the output for accuracy.
5. **Verify success** by checking the logs in CloudTrail and CloudWatch to ensure your private IP is logged instead of your actual public IP.

### Common Troubleshooting Tips
- Ensure proper IAM roles and permissions are assigned to your EC2 instance.
- If you encounter issues with connectivity, verify your VPC and endpoint configurations.
- Always check your AWS CLI configuration for correct profiles and regions.

## Key Takeaways
Today, we delved into advanced techniques of attack detection evasion, exploring how attackers can navigate AWS's security measures by mimicking legitimate traffic. Understanding these tactics is essential for developing robust defense strategies that protect sensitive information. By leveraging VPC endpoints and analyzing detection filters, cloud security professionals can stay one step ahead of potential threats.

## Real-World Applications
In actual production environments, the knowledge from today fosters a deeper understanding of how attackers think and operate in the cloud. By implementing strict network controls and monitoring mechanisms, organizations can better defend against detection evasion tactics. This knowledge can help security teams enhance their incident response strategies and reinforce their cloud security posture.

---
**Journey Progress:** 53/100 Days Complete 🚀