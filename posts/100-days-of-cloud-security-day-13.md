---
title: '100 Days of Cloud Security - Day 13: Cloud Security Journey'
date: '2025-11-22'
author: 'Venkata Pathuri'
excerpt: 'Day 13 of my cloud security journey - Cloud Security Journey'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 13: Cloud Security Journey

## Overview
Welcome to Day 13 of our cloud security learning journey! Today, we delve into the fascinating world of Identity and Access Management (IAM) by tackling a series of challenges designed to enhance your understanding of IAM policies and permissions. Building on the foundational knowledge from Day 12, where we explored the principles of least privilege and resource-based policies, today we will put that knowledge to the test through practical examples that are common in real-world scenarios.

## Learning Objectives
By the end of today’s session, you will have a solid grasp of how to analyze IAM policies, troubleshoot access issues, and leverage various AWS services effectively. You will master the art of crafting commands to interact with S3, SQS, and SNS, while also understanding the critical importance of permissions management in cloud security. This knowledge will empower you to navigate complex IAM configurations with confidence.

## Deep Dive
### Understanding IAM Policies
IAM policies define permissions for users, groups, and roles in AWS, controlling what actions they can perform on specific resources. For example, in Challenge 4, we noticed how a seemingly open S3 bucket could restrict access based on user identity. The policy allowed any principal to execute `s3:GetObject`, but also included a condition that limited `s3:ListBucket` actions to a specific user. This illustrates how IAM can create nuanced access controls that can be both powerful and complex.

### Challenge Breakdown
- **Challenge 1:** You were able to retrieve the flag from an S3 bucket using the `s3:GetObject` permission. This demonstrates the importance of understanding the precise permissions needed for specific actions.
  
- **Challenge 2:** Here, we utilized SQS permissions effectively. By understanding the resource naming conventions and querying the account number using STS, we crafted the necessary commands to receive messages from the queue.

- **Challenge 3:** The SNS subscription challenge highlighted how to create custom endpoints for notifications. Using a service like [webhook.site](https://webhook.site) allowed us to capture the confirmation URL and receive the flag, showcasing the flexibility of integrating external services with AWS.

- **Challenge 4:** This challenge taught us about anonymous access to S3 buckets. The `--no-sign-request` flag was crucial in bypassing identity verification, allowing access to the bucket contents directly.

- **Challenge 5:** Finally, we explored how to obtain credentials through Cognito. This illustrates the importance of understanding various AWS services and how they interconnect to provide secure access to resources.

### Current Best Practices
1. **Limit Permissions:** Always apply the principle of least privilege. Grant users only the permissions they absolutely need to perform their job functions.
2. **Monitor Access:** Regularly audit IAM policies and access logs to identify any anomalies or overly permissive policies.
3. **Use Multi-Factor Authentication (MFA):** Enhance security by requiring MFA for sensitive actions and accounts.
4. **Document IAM Policies:** Maintain clear documentation of IAM policies to help with audits and onboarding new team members.

## Hands-On Practice
Let’s put your newfound knowledge to the test with practical commands. 

1. **Retrieve Flag from S3:**
   ```bash
   aws s3 cp s3://thebigiamchallenge-storage-9979f4b/files/flag1.txt /tmp/
   ```
   **Expected Outcome:** You should see the flag downloaded to your local `/tmp` directory.

2. **Receive Message from SQS:**
   ```bash
   aws sqs receive-message --queue-url https://sqs.us-east-1.amazonaws.com/657483584613/wiz-tbic-analytics-sqs-queue-ca7a1b2
   ```
   **Expected Outcome:** A message containing the flag will be retrieved.

3. **Subscribe to SNS Topic:**
   ```bash
   aws sns subscribe --topic-arn arn:aws:sns:us-east-1:657483584613:TBICWizPushNotifications --protocol https --notification-endpoint "https://webhook.site/cbd205ec-6551-45c4-b26e-40decc46fbbb/@tbic.wiz.io"
   ```
   **Expected Outcome:** You will receive a confirmation URL, allowing you to capture the flag.

4. **List S3 Contents with No Sign Request:**
   ```bash
   aws s3 ls s3://thebigiamchallenge-admin-storage-abf1321/files/ --no-sign-request
   ```
   **Expected Outcome:** You should see the list of files without needing to authenticate.

5. **Get Credentials from Cognito:**
   ```bash
   aws cognito-identity get-id --identity-pool-id "us-east-1:b73cb2d2-0d00-4e77-8e80-f99d9c13da3b"
   ```
   **Expected Outcome:** Retrieve the identity ID required for further actions.

### Common Troubleshooting Tips
- If you encounter access denied errors, double-check the IAM policy for missing permissions.
- Ensure that you are using the correct region in your AWS CLI commands.
- For SQS and SNS, verify that the queue or topic ARN is correctly specified.

## Key Takeaways
Today’s challenges not only reinforced your understanding of IAM policies but also illustrated the importance of precise permission management in AWS. You learned how to interact with various AWS services effectively, troubleshooting common access issues along the way. These skills are essential as you grow in your cloud security journey.

## Real-World Applications
In the real world, organizations often face complex IAM configurations that require a deep understanding of how permissions interact across various AWS services. By mastering these concepts, you are better equipped to implement secure access controls in production environments, reduce the risk of unauthorized access, and ensure compliance with best practices in cloud security.

---
**Journey Progress:** 13/100 Days Complete 🚀