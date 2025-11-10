---
title: '100 Days of Cloud Security - Day 3: Cloud Security Journey'
date: '2025-11-10'
author: 'Venkata Pathuri'
excerpt: 'Day 3 of my cloud security journey - Cloud Security Journey'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 3: Cloud Security Journey

## Overview
Welcome back to Day 3 of our 100-day exploration into cloud security! Today's adventure builds on the foundational concepts we learned about in Day 2, where we delved into AWS Identity and Access Management (IAM) — the backbone of access control in the cloud. We’ll now take a step further into the world of AWS services, specifically focusing on how to identify and exploit vulnerabilities in AWS SNS (Simple Notification Service) and API Gateway. Get ready to engage in a practical attack scenario that not only reinforces your understanding of these services but also highlights the importance of robust security practices.

## Learning Objectives
By the end of today’s session, you will master the art of deploying and attacking the CloudGoat scenario `sns_secrets`. You’ll learn how to enumerate users and IAM policies, subscribe to SNS topics to retrieve sensitive data, and ultimately invoke an API Gateway using a leaked API key. This exercise not only demonstrates how attackers might exploit cloud services but also provides insight into how to defend against such vulnerabilities.

## Deep Dive
### Understanding SNS and API Gateway

AWS SNS is a powerful notification service that allows you to decouple microservices and deliver messages across various protocols, such as HTTP, email, and SMS. However, with great power comes great responsibility. Misconfigurations and overly permissive IAM policies can lead to severe vulnerabilities, such as exposing sensitive messages or API keys.

Similarly, AWS API Gateway serves as the entry point for your APIs, facilitating the connection between clients and your backend services. It is crucial to manage API keys and access controls vigilantly, as these keys can be exposed through other services like SNS, leading to unauthorized access.

### Step-by-Step Breakdown of the `sns_secrets` Attack Scenario

1. **Setup Your Environment**: First, ensure you have a dedicated AWS profile configured for the lab. This helps isolate your learning environment from any live production settings.

2. **Deploy the Scenario**: Launch the `sns_secrets` scenario in CloudGoat, allowing you to simulate an environment where vulnerabilities exist.

3. **User and Policy Enumeration**: Utilize AWS CLI commands to list IAM users and associated policies. You’ll identify a user and their permissions, noting both allowed actions and specific denies. This is critical for understanding potential attack vectors.

4. **Subscribe to the SNS Topic**: After identifying the SNS topic, subscribe an email address to it. This will facilitate your receipt of any messages, such as the leaked API key.

5. **Confirm Subscription**: Click the confirmation link sent to your email to activate your subscription. This step is essential for receiving notifications.

6. **Receive the Leaked API Key**: Monitor your email for the SNS notification containing the API key. This is a prime example of how sensitive data can be inadvertently exposed.

7. **API Gateway Interaction**: Finally, use the retrieved API key to access the API Gateway endpoint. Construct the invocation URL in the format `https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/{resource}`. Ensure you include the necessary headers for authentication.

### Current Best Practices
To prevent such vulnerabilities in real-world applications:
- Implement the principle of least privilege in IAM policies, ensuring users have only the permissions necessary for their role.
- Regularly audit SNS topics and subscriptions for sensitive data exposure.
- Use encryption for sensitive messages and secure transport protocols.
- Monitor API usage and enforce rate limiting to detect and mitigate abuse.

## Hands-On Practice
To put your knowledge into practice, execute the following AWS CLI commands step-by-step:

1. **List IAM Users**:
   ```bash
   aws iam list-users --profile 100days
   ```

2. **List User Policies**:
   ```bash
   aws iam list-user-policies --user-name cg-sns-user-cgid4osa6lp4g4 --profile 100days
   ```

3. **Subscribe to SNS Topic**:
   ```bash
   aws sns subscribe --topic-arn "arn:aws:sns:us-east-1:997581282912:public-topic-cgid4osa6lp4g4" --protocol email --notification-endpoint your_email@example.com --profile 100days --region us-east-1
   ```

4. **Check Subscription Status**:
   ```bash
   aws sns list-subscriptions --profile 100days
   ```

5. **Invoke the API Gateway**:
   Construct your API call using the URL format mentioned earlier, ensuring to pass the API key in the appropriate header.

### Troubleshooting Tips
- If your subscription shows as "Deleted," ensure you followed the confirmation link correctly.
- Double-check your IAM policies if you encounter permission issues when trying to access resources.

## Key Takeaways
Through today's lessons, you’ve discovered the intricate workings of AWS SNS and API Gateway. You’ve seen firsthand how an attacker could exploit poor configurations and excess permissions to gain access to sensitive information. The ability to enumerate IAM roles and policies is crucial for both offensive and defensive cybersecurity strategies.

## Real-World Applications
In production environments, organizations must remain vigilant about the configurations of their AWS services. Regular audits, adherence to security best practices, and employing monitoring tools can significantly reduce the risk of such vulnerabilities being exploited. Understanding these principles not only enhances security posture but also prepares you for future challenges in your cloud security journey.

## What's Next?
In Day 4, we will delve into another exciting topic, focusing on the importance of logging and monitoring in cloud environments. We’ll explore how to effectively set up logging mechanisms and use them to detect intrusions and other anomalies. Stay tuned for more hands-on learning and practical insights!

---
**Journey Progress:** 3/100 Days Complete 🚀