---
title: '100 Days of Cloud Security - Day 39: Attack — `Glue_privesc` - Part 1'
date: '2025-12-18'
author: 'Venkata Pathuri'
excerpt: 'Day 39 of my cloud security journey - Attack — `Glue_privesc` - Part 1'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 39: Attack — `Glue_privesc` - Part 1

## Overview
Welcome back to Day 39 of our cloud security journey! Today, we dive into the intriguing world of privilege escalation through the AWS Glue service with the `Glue_privesc` attack scenario. Building on the foundational knowledge we established in Day 38, where we explored various attack vectors, this session will deepen your understanding of how misconfigurations and vulnerabilities in serverless architectures can be exploited. Get ready to unravel the complexities of AWS services, focusing on how attackers leverage these components to gain unauthorized access.

## Learning Objectives
By the end of today’s lesson, you will have successfully deployed the `Glue_privesc` scenario using CloudGoat, a tool designed for testing AWS security configurations. You'll gain insights into how secrets are managed in the AWS Systems Manager (SSM) Parameter Store and understand the implications of poor security practices in serverless environments. Additionally, you will learn to recognize the signs of SQL injection vulnerabilities and how they can affect web applications hosted on AWS.

## Deep Dive
### Understanding the Glue Service
AWS Glue is a fully managed ETL (Extract, Transform, Load) service that makes it easy to prepare your data for analytics. However, like many AWS services, if not properly configured, it can present security risks. The `Glue_privesc` scenario demonstrates how attackers can exploit these configurations to gain unauthorized access or elevate their privileges within an AWS environment.

### Scenario Setup
In our scenario, we will deploy:
- 1 Virtual Private Cloud (VPC)
- 1 Amazon S3 bucket for data storage
- 1 Amazon RDS instance for database hosting
- 1 Amazon EC2 instance that serves as our application server
- 1 AWS Lambda function to handle serverless processing
- The SSM Parameter Store to manage secrets securely
- 2 IAM Users to simulate different access levels

The initial setup of this scenario faced challenges, particularly with whitelisting configurations and RDS creation timeouts. These are common pitfalls in AWS deployments; always ensure your security groups and IAM policies are correctly defined before proceeding.

### Upload Page Vulnerability
Upon deploying the application, you will notice a monitoring page that allows users to upload data. The upload function is facilitated via a simple HTTP endpoint (http://54.198.228.207:5000/upload_to_s3). This is a critical point of focus as it can be exploited if not properly secured. 

![Monitoring Page Example](../img/day39-01.png)

### SQL Injection Vulnerability
As you interact with the web application, you’ll discover that it is susceptible to SQL injection attacks. By passing SQL payloads, you can manipulate the underlying database queries. This highlights the importance of validating and sanitizing input data in any web application, especially those interacting with databases.

## Hands-On Practice
To begin your practical experience, follow these steps:

1. **Deploy the `Glue_privesc` Scenario**:
   ```bash
   cloudgoat deploy glue_privesc
   ```
   **Expected Outcome**: The scenario should deploy successfully, which includes all specified AWS resources.

2. **Access the Monitoring Page**: 
   Navigate to the upload page using the provided URL. You should see an interface that allows file uploads.

3. **Test SQL Injection**:
   Use a basic SQL injection payload, such as:
   ```sql
   ' OR '1'='1
   ```
   **Expected Outcome**: Observe how the application responds to this input. A successful injection could reveal sensitive information or alter database behavior.

4. **Verify SSM Parameter Store**:
   Check the SSM Parameter Store for any secrets that may have been created during the deployment:
   ```bash
   aws ssm get-parameter --name "/cloudgoat/glue_privesc/secret" --with-decryption
   ```

5. **Common Troubleshooting Tips**:
   - Ensure your IAM user has the necessary permissions to access SSM and deploy CloudGoat.
   - If the RDS instance fails to create, double-check your VPC configuration and security group rules.

**Note**: Always replace any example credentials in your commands with your actual credentials or use environment variables:
```bash
export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours # Replace with your actual credentials
export AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY # Replace with your actual credentials
```

## Key Takeaways
Today, we explored the `Glue_privesc` scenario, which serves as a practical demonstration of the vulnerabilities that can arise from misconfigured AWS services. Understanding how to identify and exploit these weaknesses is crucial for building robust security measures. We also highlighted the importance of proper input validation and security practices in web applications.

## Real-World Applications
In production environments, the lessons learned from today’s scenario can be applied to enhance security postures. By conducting regular security audits, employing tools to test for vulnerabilities, and educating developers about secure coding practices, organizations can significantly reduce their risk exposure. Awareness of how services like AWS Glue can be exploited will empower security teams to implement effective controls and monitoring solutions.

---
**Journey Progress:** 39/100 Days Complete 🚀