---
title: '100 Days of Cloud Security - Day 4: Defend - `sns_secrets`'
date: '2025-11-10'
author: 'Venkata Pathuri'
excerpt: 'Day 4 of my cloud security journey - Defend - `sns_secrets`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 4: Defend - `sns_secrets`

## Overview
Welcome back to our cloud security journey! Today, we delve into a critical aspect of securing AWS services by addressing vulnerabilities within the `sns_secrets` scenario. Building on our foundational knowledge from Day 3, we will explore how to defend against an attacker who could exploit the combination of `sns:Subscribe` and `apigateway:GET` actions. By implementing Cloud Security Posture Management (CSPM) strategies, we can fortify our defenses and safeguard sensitive data.

## Learning Objectives
Today, you will master the art of defending AWS resources through layered security measures. You’ll learn how to effectively configure IAM policies, apply security best practices for Amazon SNS (Simple Notification Service), and secure API Gateway access. By the end of this session, you will have a robust understanding of how to create a secure cloud environment while enabling essential functionality, ensuring you’re well-prepared to guard against potential threats.

## Deep Dive
### Understanding the Vulnerability
In our `sns_secrets` lab, we identified a vulnerability that arises from the interplay between SNS and API Gateway. The assumption that IAM policies alone could restrict access was flawed. An attacker might leverage the `sns:Subscribe` permission alongside open API Gateway access, creating a potential attack vector.

### Security Assessment Reports
To fortify our defenses, I utilized security assessment tools like Prowler and ScoutSuite. These tools provided valuable insights into existing vulnerabilities and improvement areas. For example, Prowler highlighted the need for API Gateway monitoring, while ScoutSuite pointed out the lack of encryption in SNS topics.

### Implementing Mitigations
1. **Policy Adjustments**: I implemented explicit deny statements on sensitive actions for both SNS and API Gateway. This ensures that even if a user has permissions, the deny statements take precedence, blocking unwanted actions.
   
   Example IAM Policy:
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Sid": "AllowSafeSnsAndBasicIamList",
         "Effect": "Allow",
         "Action": [...],
         "Resource": "*"
       },
       {
         "Sid": "ExplicitDeny_SnsSubscribePublishReceiveSetAttrs",
         "Effect": "Deny",
         "Action": [...],
         "Resource": "*"
       },
       {
         "Sid": "ExplicitDeny_ApiGateway_ApiKeyAndIntegrationAccess",
         "Effect": "Deny",
         "Action": [...],
         "Resource": [...]
       },
       {
         "Sid": "AllowCloudTrailReadIfNeeded",
         "Effect": "Allow",
         "Action": ["cloudtrail:LookupEvents"],
         "Resource": "*"
       }
     ]
   }
   ```

2. **Logging and Monitoring**: I enabled CloudTrail for tracking management events, which is essential for auditing and monitoring changes in the AWS environment. Additionally, API Gateway logs were activated, providing visibility into incoming requests and any potential anomalies.

3. **Encryption and Security Enhancements**: I enforced server-side encryption for SNS messages using AWS Key Management Service (KMS). This is crucial for protecting sensitive data in transit and at rest.

4. **Web Application Firewall (WAF)**: Integrating WAF with API Gateway adds another layer of protection, filtering out malicious requests before they reach our application.

### Visualizing the Setup
As you implement these security measures, you’ll notice a more secure architecture. For instance, the CloudTrail dashboard provides a comprehensive view of your AWS account’s activities, while API Gateway logs reveal detailed request information. This visibility is critical for identifying and responding to security incidents.

## Hands-On Practice
To put these concepts into action, follow these steps:

1. **Run Security Assessments**: Use Prowler and ScoutSuite to generate security reports for your AWS account. Review the findings and prioritize actions based on risk.
   
2. **Update IAM Policies**: Use the AWS Management Console or CLI to implement the updated IAM policy, ensuring you incorporate explicit deny statements for SNS and API Gateway actions.

3. **Enable CloudTrail and API Gateway Logs**: Navigate to the CloudTrail and API Gateway sections in the AWS Console to enable logging. Confirm that logging is active by checking the respective dashboards.

4. **Configure Encryption**: Set up server-side encryption for SNS topics using KMS, ensuring that sensitive data is adequately protected.

5. **Deploy WAF**: Follow AWS documentation to integrate WAF with your API Gateway, setting up rules to block malicious traffic.

### Verification
After implementing these changes, verify their success by checking the CloudTrail logs for recorded activities, inspecting API Gateway logs for access attempts, and ensuring that the SNS topics are encrypted.

## Key Takeaways
In our exploration of defending the `sns_secrets` scenario, we learned that API security requires a multifaceted approach. Relying solely on IAM policies is insufficient; we must integrate resource-based policies, network controls, and continuous monitoring. Additionally, treating sensitive data with care—such as avoiding sending secrets via SNS—underlines the importance of adhering to best practices.

## Real-World Applications
These security concepts are not just theoretical; they apply directly to production environments where sensitive data needs protection. Organizations must implement robust IAM policies, monitor API access, and use encryption to safeguard their cloud resources. Consider a financial services firm that handles customer data; failure to secure SNS and API Gateway could lead to data breaches and regulatory penalties. By adopting these practices, companies can enhance their overall security posture.

## What's Next?
As we look ahead to Day 5, we will build on today’s defenses by exploring incident response strategies and how to automate security monitoring. Get ready to enhance your skills further and take your cloud security knowledge to the next level!

---
**Journey Progress:** 4/100 Days Complete 🚀