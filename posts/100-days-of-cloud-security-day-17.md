---
title: '100 Days of Cloud Security - Day 17: Attack — `sqs_flag_shop`'
date: '2025-11-26'
author: 'Venkata Pathuri'
excerpt: 'Day 17 of my cloud security journey - Attack — `sqs_flag_shop`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 17: Attack — `sqs_flag_shop`

## Overview
Welcome back to Day 17 of our cloud security journey! Today, we dive into a fascinating scenario using AWS's Simple Queue Service (SQS) to exploit a web application vulnerability. Building on the foundational knowledge from Day 16, where we explored IAM roles and permissions, we’ll apply those concepts to manipulate the SQS queue, bypassing front-end restrictions to achieve our goal: purchasing a flag from a simulated shop. This exercise not only sharpens our technical skills but also provides insights into potential security weaknesses in cloud applications.

## Learning Objectives
By the end of today’s session, you will master how to identify security flaws within cloud applications utilizing SQS. You’ll understand the mechanics of how SQS operates, learn to inspect IAM permissions effectively, and discover how to craft messages that can manipulate application behavior. This hands-on experience will bolster your ability to assess the security posture of cloud services and recognize the implications of trust boundaries in application architecture.

## Deep Dive
### Understanding SQS
AWS Simple Queue Service (SQS) allows applications to communicate asynchronously through message queues. This decoupling of components is vital for building scalable and robust cloud applications. In a typical scenario, a producer (like a web application) sends messages (such as charge requests) to the SQS queue, while a consumer (like a backend worker) retrieves and processes those messages.

#### Real-World Example
Consider a banking application that uses SQS to manage transactions. When a user initiates a transfer, the request is sent to an SQS queue, ensuring that the application remains responsive even if the processing takes time. However, if the queue can be manipulated, an attacker could potentially send false messages to alter account balances.

### The SQS Attack Scenario
In our `sqs_flag_shop` scenario, we encounter a web application that allows small charge amounts through its front-end interface. However, the back-end worker processes messages from the SQS queue without validating their content rigorously. This flaw presents an opportunity for exploitation, as we can send a crafted message directly to the queue.

1. **Exploring the Web App**
   - Navigate to the charge page at `http://54.162.34.195:5000/charge`. Here, you can see the front-end interface limiting charge amounts to small values.

2. **IAM Permissions Review**
   - Inspect the IAM user permissions for `cg-sqs-user-cgidvnivmbbemy`. The ability to assume a role that allows sending messages to the SQS queue is crucial. This privilege reveals a significant potential for abuse.

3. **Interacting with the SQS Queue**
   - We found the queue URL: `https://sqs.us-east-1.amazonaws.com/997581282912/cash_charging_queue`. While we initially received no useful feedback when trying to read the queue, we understood its role in processing charge requests.

4. **Exploiting the Application Logic**
   - The application accepts any message content in `cash_charging_queue`. By crafting a message with a significantly inflated charge amount, we bypassed the front-end restrictions. 

### Crafting the Message
Using the AWS CLI, we can send a message directly to the queue:

```bash
aws sqs send-message \
  --queue-url https://sqs.us-east-1.amazonaws.com/997581282912/cash_charging_queue \
  --message-body '{"charge_amount":500000000}' \
  --profile cg
```

After the message is processed, our account balance reflects the unauthorized increase, allowing us to purchase the flag.

## Hands-On Practice
To engage actively with this learning, follow these steps:

1. **Access the Charge Page**: Visit the specified URL and familiarize yourself with the user interface.
2. **Check IAM Policies**: Use the AWS Management Console or CLI to list the IAM policies for your user.
3. **Send a Message**: Utilize the provided AWS CLI command to send a crafted message to the SQS queue.
4. **Verify the Outcome**: Check your account balance on the web app to confirm the unauthorized credit increase.

### Troubleshooting Tips
- Ensure your AWS CLI is configured correctly with the necessary permissions.
- If you encounter issues sending messages, double-check the queue URL and JSON format in the message body.
- Monitor the SQS console for message processing errors.

## Key Takeaways
Today, we learned that while cloud services like SQS provide powerful ways to decouple application components, they can also lead to significant vulnerabilities when not properly secured. By understanding the mechanics of message queuing and the implications of IAM permissions, we positioned ourselves to identify and exploit weaknesses in cloud applications. This experience highlights the critical importance of validating all inputs and maintaining robust security practices in cloud architectures.

## Real-World Applications
The knowledge gained from this exercise is directly applicable in real-world environments. Organizations leveraging AWS SQS should ensure that they enforce strict validation on message content and permissions. Implementing comprehensive monitoring and logging can help detect suspicious activities, while regular security audits can identify and mitigate potential vulnerabilities before they are exploited.

---

**Journey Progress:** 17/100 Days Complete 🚀