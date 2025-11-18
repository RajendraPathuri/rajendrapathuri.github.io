---
title: '100 Days of Cloud Security - Day 9: AWS Lambda Privilege Escalation - Penetration Test Report - Claude Code'
date: '2025-11-18'
author: 'Venkata Pathuri'
excerpt: 'Day 9 of my cloud security journey - AWS Lambda Privilege Escalation - Penetration Test Report - Claude Code'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 9: AWS Lambda Privilege Escalation - Penetration Test Report - Claude Code

## Overview

In our cloud security journey, we now delve into a critical vulnerability that can lead to severe consequences if left unchecked: AWS Lambda privilege escalation. Building on our previous discussions around identity and access management (IAM) and the importance of least privilege, today we will explore a real-world penetration test report that highlights the risks associated with poor IAM configurations. Understanding this vulnerability will not only enhance your security posture but will also prepare you to identify and mitigate similar issues in your environments.

## Learning Objectives

By the end of this session, you will master the intricacies of AWS Lambda privilege escalation, including how attackers exploit IAM role assumptions and Lambda function manipulations. You will learn to analyze IAM policies critically, identify vulnerabilities, and understand the ramifications of excessive permissions. Moreover, this knowledge will empower you to implement best practices that fortify your AWS environment against these types of attacks.

## Deep Dive

### Understanding the Vulnerability

In today's report, we examined a scenario where an IAM user, `chris-cgide3k5k2fwj7`, was able to escalate privileges simply by manipulating overly permissive IAM policies. The user was granted the ability to assume roles without restriction, which is a significant security oversight. The report illustrates a step-by-step attack chain that allows an attacker to gain full access to AWS Lambda functions, potentially leading to complete account compromise.

#### Key Findings from the Penetration Test

1. **Overly Permissive IAM Policies**: The user had unrestricted permissions to assume any role in the account. This lack of constraints enabled attackers to list all roles and their permissions easily.
   
2. **Lambda Permissions**: The target IAM role had full Lambda permissions, allowing the attacker to create, modify, and invoke Lambda functions. This included the ability to pass IAM roles to Lambda functions, which could lead to further privilege escalation or data exfiltration.

3. **Access Key Exposure**: The active access key for the vulnerable user was found in plaintext, making it easy for an attacker to exploit it.

### Real-World Example

Imagine a scenario where a developer is given permissions to assume any IAM role in a production environment without any restrictions. Such an oversight could lead to attackers gaining access to sensitive data or systems, potentially resulting in significant financial and reputational damage. The report illustrates exactly how this could unfold, emphasizing the need for stringent IAM policies.

### Best Practices

To prevent such vulnerabilities, consider the following best practices:

- **Implement Least Privilege**: Limit permissions to only what is necessary for users to perform their roles. For example, instead of allowing `lambda:*`, specify actions like `lambda:InvokeFunction` or `lambda:GetFunction`.
  
- **Use Conditions in IAM Policies**: Leverage condition keys in IAM policies to restrict access based on factors like IP address or the presence of MFA.

- **Regularly Rotate Access Keys**: Ensure that AWS access keys are rotated regularly and stored securely. Avoid hard-coding them in source code or configuration files.

- **Enable Monitoring and Alerts**: Utilize AWS CloudTrail and CloudWatch to track API calls and set up alerts for unusual activities, such as unexpected role assumptions or Lambda function creations.

## Hands-On Practice

### Steps to Secure IAM Policies

1. **Review IAM Policies**: Use the AWS Management Console or CLI to list IAM policies attached to users and roles. Look for overly permissive policies.
   ```bash
   aws iam list-policies --scope Local
   ```

2. **Restrict AssumeRole Permissions**: Update IAM policies to limit which roles can be assumed by specifying the role ARN and using conditions.
   ```json
   {
     "Effect": "Allow",
     "Action": "sts:AssumeRole",
     "Resource": "arn:aws:iam::your-account-id:role/specific-role-name",
     "Condition": {
       "IpAddress": {
         "aws:SourceIp": ["10.0.0.0/8"]
       }
     }
   }
   ```

3. **Enable CloudTrail**: Make sure that CloudTrail is enabled to log all API calls made within your AWS account.
   ```bash
   aws cloudtrail create-trail --name MyTrail --s3-bucket-name mybucket
   ```

### Verification

After implementing the changes, verify that the policies are functioning as intended by testing the permissions with the IAM Policy Simulator. This tool helps ensure that your configurations are secure without inadvertently blocking necessary actions.

## Key Takeaways

The critical lesson from today's exploration is the importance of rigorous IAM management and the need for continuous monitoring. The vulnerabilities discovered in the AWS Lambda environment serve as a stark reminder of how small oversights in permission management can lead to catastrophic consequences. By implementing best practices and regularly reviewing IAM policies, you can drastically reduce the attack surface in your cloud environments.

## Real-World Applications

In production environments, understanding privilege escalation is essential for maintaining robust security. Organizations can apply the insights gained from this report to conduct thorough audits of their IAM configurations, ensuring that permissions are tightly controlled and monitored. By fostering a culture of security awareness and implementing preventive measures, businesses can safeguard their cloud resources against evolving threats.

---

**Journey Progress:** 9/100 Days Complete 🚀