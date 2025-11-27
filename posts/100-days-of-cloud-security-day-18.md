---
title: '100 Days of Cloud Security - Day 18: Defend - `sqs_flag_shop`'
date: '2025-11-27'
author: 'Venkata Pathuri'
excerpt: 'Day 18 of my cloud security journey - Defend - `sqs_flag_shop`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 18: Defend - `sqs_flag_shop`

## Overview
Welcome back to our cloud security journey! Today, we dive into defending the `sqs_flag_shop` scenario by implementing access restrictions that safeguard sensitive user functions while still allowing necessary operations. Building on our previous discussions around IAM roles and policies, we'll focus on enhancing security through effective management of AWS SQS (Simple Queue Service). By the end of this lesson, you’ll understand how to restrict user capabilities and protect your resources against misuse.

## Learning Objectives
In today’s session, you will master the principles of securing AWS SQS by restricting user access to certain actions. You will learn how to delete unnecessary role policies, implement specific SQS access policies, modify user permissions, and integrate CloudTrail for comprehensive logging. This knowledge will empower you to create secure environments where users can perform necessary tasks without compromising sensitive actions.

## Deep Dive
### Understanding AWS SQS
AWS SQS is a fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications. It allows you to send, store, and receive messages between software components at any volume without losing messages. However, with great power comes great responsibility. Misconfigured permissions can expose your queues to unauthorized access or misuse.

### Key Concepts of Access Management
1. **Role Policies**: These define what actions can be performed by which AWS entities. In our scenario, we deleted an unnecessary role policy, `cg-sqs-send-message-cgidvnivmbbemy`, which could have allowed unauthorized access to the SQS queue.
   
2. **SQS Access Policy**: We implemented a refined access policy that allows only specific users to send messages to the queue while denying all others. This policy includes conditions that ensure actions are only permitted from designated sources.

3. **User Policies**: The `cg-sqs-user-cgidvnivmbbemy` policy was modified to remove `sts:AssumeRole`. This change prevents users from gaining additional permissions beyond what is explicitly granted, further tightening security.

### SQS Access Policy Breakdown
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowOnlyEC2UserToSend",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::997581282912:user/cg-web-sqs-manager-cgidvnivmbbemy"
      },
      "Action": "sqs:SendMessage",
      "Resource": "arn:aws:sqs:us-east-1:997581282912:cash_charging_queue",
      "Condition": {
        "StringEquals": {
          "aws:SourceVpc": "vpc-xxxxxxxxx"
        }
      }
    },
    {
      "Sid": "AllowOnlyLambdaToReceive",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::997581282912:role/cg-sqs-lambda-cgidvnivmbbemy"
      },
      "Action": [
        "sqs:ReceiveMessage",
        "sqs:DeleteMessage",
        "sqs:GetQueueAttributes"
      ],
      "Resource": "arn:aws:sqs:us-east-1:997581282912:cash_charging_queue"
    },
    {
      "Sid": "DenyAllOthers",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "sqs:*",
      "Resource": "arn:aws:sqs:us-east-1:997581282912:cash_charging_queue",
      "Condition": {
        "StringNotLike": {
          "aws:PrincipalArn": [
            "arn:aws:iam::997581282912:user/cg-web-sqs-manager-cgidvnivmbbemy",
            "arn:aws:iam::997581282912:role/cg-sqs-lambda-cgidvnivmbbemy"
          ]
        }
      }
    }
  ]
}
```
This policy ensures that only the designated user can send messages, while a specific Lambda function is allowed to receive, delete, and get attributes from the queue.

## Hands-On Practice
Here are the steps to implement these changes in your AWS environment:

1. **Delete the Role Policy**:
   - Navigate to the IAM console.
   - Locate and delete the `cg-sqs-send-message-cgidvnivmbbemy` role policy.

2. **Add the SQS Access Policy**:
   - Go to your SQS console.
   - Select the `cash_charging_queue`.
   - Add the new access policy shown above.

3. **Modify the User Policy**:
   - Access the IAM user policies.
   - Remove the `sts:AssumeRole` permission from the `cg-sqs-user-cgidvnivmbbemy` policy.

### Expected Outcomes
After implementing these changes, you should see that only the `cg-web-sqs-manager-cgidvnivmbbemy` user can send messages to the queue, while the Lambda function can perform its designated actions. Unauthorized users will be denied access, effectively securing your SQS resource.

### Common Troubleshooting Tips
- If users report access issues, double-check the IAM policies for typos or misconfigurations.
- Monitor CloudTrail logs to identify any unauthorized access attempts or errors related to SQS actions.

## Key Takeaways
Today, we tackled the critical task of securing AWS SQS by restricting user access to sensitive operations. By deleting unnecessary roles, implementing stringent access policies, and modifying user permissions, we fortified our cloud environment. These practices not only protect against unauthorized access but also ensure that users can still perform their required functions without compromising security.

## Real-World Applications
In production environments, implementing such access controls is vital for maintaining the integrity and security of applications reliant on SQS. For example, an e-commerce platform that uses SQS for processing orders must ensure that only authorized systems can modify order statuses or payment information. By following the strategies discussed today, organizations can prevent potential breaches and protect sensitive user data.

---
**Journey Progress:** 18/100 Days Complete 🚀