---
title: '100 Days of Cloud Security - Day 4: Defend - `sns_secrets`'
date: '2025-11-13'
author: 'Venkata Pathuri'
excerpt: 'Day 4 of my cloud security journey - Defend - `sns_secrets`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 4: Defend - `sns_secrets`

## Overview
As we continue our cloud security journey, Day 4 focuses on defending against vulnerabilities specific to AWS services, particularly the interplay between Amazon Simple Notification Service (SNS) and API Gateway. Building on the foundational knowledge of identity and access management (IAM) from Day 3, today we explore how improper assumptions about API Gateway permissions can lead to serious security risks. By identifying and mitigating these vulnerabilities, we take significant steps towards safeguarding our cloud environment.

## Learning Objectives
Today, we aim to master the art of defending cloud resources by implementing Cloud Security Posture Management (CSPM) strategies. You will learn how to secure SNS subscriptions, enforce stricter API Gateway access controls, and implement logging and monitoring solutions. By the end of this session, you’ll be equipped with practical skills to enhance security in your AWS environment, ensuring that both your APIs and messaging services are robust against unauthorized access.

## Deep Dive
### Understanding the Vulnerability
In our scenario, the initial vulnerability arose from the assumption that IAM policies would adequately restrict access to the API Gateway. However, when combined with SNS's inherent permissions, this assumption proved dangerous. Attackers could exploit the `sns:Subscribe` and `apigateway:GET` actions, gaining unauthorized access to sensitive information. 

### Best Practices for Mitigation
1. **Explicit Deny Policies**: By applying explicit deny policies for actions like `sns:Subscribe` and `sns:Publish`, we can prevent unauthorized users from interacting with our SNS topics. This is a critical first step in creating a secure messaging environment. 

2. **Resource-Based Policies**: In addition to IAM policies, implementing resource-based policies for both SNS and API Gateway enhances security. These policies ensure that only authorized resources can invoke actions on the topics and APIs.

3. **CloudTrail and Logging**: Enabling CloudTrail provides comprehensive logging for all API calls, offering visibility into who accessed what and when. This is vital for compliance and incident response.

4. **Encryption with KMS**: Utilizing AWS Key Management Service (KMS) for server-side encryption of SNS messages protects the confidentiality of sensitive data.

5. **Web Application Firewall (WAF)**: Integrating WAF with the API Gateway adds another layer of protection by filtering harmful web traffic and controlling access to the APIs.

### Visual Description
Imagine your AWS console filled with resources neatly organized, each protected by layers of security. You see CloudTrail logs capturing every event, WAF rules in place filtering malicious requests, and encrypted SNS topics ensuring that sensitive messages remain confidential. This structured defense not only secures your environment but also builds a resilient architecture against attacks.

## Hands-On Practice
Here’s how to implement the security measures discussed:

1. **Run Security Assessments**: Start by running Prowler and ScoutSuite against your AWS account to identify vulnerabilities.

2. **Modify IAM Policies**: Use the following JSON structure to update your IAM policies:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AllowSafeSnsAndBasicIamList",
         "Effect": "Allow",
         "Action": [
           "sns:ListTopics",
           "sns:GetTopicAttributes",
           "sns:ListSubscriptionsByTopic",
           "sns:ListSubscriptions",
           "iam:ListUsers",
           "iam:GetUser",
           "iam:ListRoles"
         ],
         "Resource": "*"
       },
       {
         "Sid": "ExplicitDeny_SnsSubscribePublishReceiveSetAttrs",
         "Effect": "Deny",
         "Action": [
           "sns:Subscribe",
           "sns:ConfirmSubscription",
           "sns:SetSubscriptionAttributes",
           "sns:Unsubscribe",
           "sns:Publish",
           "sns:Receive"
         ],
         "Resource": "*"
       },
       {
         "Sid": "ExplicitDeny_ApiGateway_ApiKeyAndIntegrationAccess",
         "Effect": "Deny",
         "Action": [
           "apigateway:GET",
           "apigateway:PUT",
           "apigateway:POST",
           "apigateway:DELETE"
         ],
         "Resource": [
           "arn:aws:apigateway:*::/apikeys",
           "arn:aws:apigateway:*::/apikeys/*",
           "arn:aws:apigateway:*::/restapis/*/resources/*/methods/*/integration",
           "arn:aws:apigateway:*::/restapis/*/integration",
           "arn:aws:apigateway:*::/restapis/*/methods/*"
         ]
       },
       {
         "Sid": "AllowCloudTrailReadIfNeeded",
         "Effect": "Allow",
         "Action": [
           "cloudtrail:LookupEvents"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

3. **Enable CloudTrail and Logging**: In the console, navigate to CloudTrail and API Gateway settings to enable logging.

4. **Set Up CloudWatch Alarms**: Deploy metrics and alarms in CloudWatch to monitor API usage and SNS message handling.

5. **Encrypt SNS Topics**: Use the AWS KMS console to enable server-side encryption for your SNS topics.

### Expected Outcomes
Once you've implemented these measures, you should see heightened security against unauthorized access attempts, logged activities in CloudTrail, and encrypted messages in your SNS topics. 

### Common Troubleshooting Tips
- If you encounter access denied errors, double-check your IAM policies for correct resource ARNs and permissions.
- Ensure that CloudTrail is correctly configured to capture all management events.
- Review WAF logs to identify any blocked requests that may need adjustment.

## Key Takeaways
Today, we reinforced the importance of multi-layered security in cloud environments. Relying solely on IAM policies is insufficient; instead, we must integrate resource-based policies, robust logging, and encryption mechanisms. This holistic approach not only mitigates risks but also enhances our ability to respond to incidents effectively.

## Real-World Applications
In production environments, the lessons learned today translate into tangible security improvements. Organizations handling sensitive user data or critical business processes must adopt these practices to prevent data leaks and unauthorized access. For example, a financial services company might implement similar strategies to secure customer notifications and API endpoints, ensuring compliance with regulatory requirements while providing a secure user experience.

---
**Journey Progress:** 4/100 Days Complete 🚀