---
title: '100 Days of Cloud Security - Day 62: Cloud Security Journey'
date: '2026-01-10'
author: 'Venkata Pathuri'
excerpt: 'Day 62 of my cloud security journey - Cloud Security Journey'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 62: Cloud Security Journey

## Overview
Welcome back to our cloud security journey! As we traverse through Day 62, we delve deeper into an essential framework that underpins cloud security practices: the CIA Triad (Confidentiality, Integrity, Availability) and the AAA model (Authentication, Authorization, Accounting). Building on the foundational knowledge from Day 61, we will explore AWS services that bolster these principles, providing you with a robust understanding of how to secure your cloud environments effectively.

## Learning Objectives
By the end of today’s lesson, you will master the key AWS services that enhance confidentiality, integrity, and availability of your data. You will also grasp the roles of IAM and the AWS Shared Responsibility Model, enabling you to distinguish between AWS's responsibilities and your own as a user. Additionally, you will learn best practices for managing IAM policies and responding to credential compromises, empowering you to secure your cloud applications with confidence.

## Deep Dive

### CIA Triad

1. **Confidentiality**: To ensure that your data remains confidential, AWS provides several tools:
   - **IAM (Identity and Access Management)**: Control who can access your resources.
   - **KMS (Key Management Service)**: Easily manage encryption keys for your data.
   - **Bucket Policies and ACLs**: Fine-tune access to your S3 buckets.
   - **Security Groups**: Act as virtual firewalls to control inbound and outbound traffic.
   - **Multi-Factor Authentication (MFA)**: Adds an extra layer of security during user authentication.

   For instance, if you're hosting sensitive customer information in S3, you can set policies to ensure that only specific IAM roles can access that data, while using KMS to encrypt it at rest.

2. **Integrity**: To maintain data integrity, consider using:
   - **S3 Object Lock**: Prevents objects from being deleted or overwritten for a specified period.
   - **S3 Versioning**: Keeps multiple versions of an object, allowing you to recover from accidental deletions or overwrites.
   - **IAM Policies**: Implement strict policies to ensure only authorized users can modify data.

   A practical example would be enabling S3 Object Lock for your financial records to ensure compliance with regulations that require data retention.

3. **Availability**: Ensuring your data is always accessible can be achieved through:
   - **Multiple Availability Zones**: Distributing resources across different locations to minimize downtime.
   - **Auto Scaling**: Automatically adjusts the capacity based on traffic demands.
   - **Health Checks**: Monitors the health of your applications and can reroute traffic as needed.

   Imagine an e-commerce website that experiences a surge in visitors during a sale. By utilizing auto-scaling and multiple availability zones, you can ensure that the site remains operational with minimal downtime.

### AAA Model

1. **Authentication**: Users authenticate themselves via IAM, which allows you to create users and roles, and manage their access.
2. **Authorization**: Once authenticated, IAM permissions and policies determine what actions users can perform.
3. **Accounting**: AWS CloudTrail and CloudWatch track user activities, helping you maintain an audit trail of access and changes made to your resources.

### AWS Shared Responsibility Model

Understanding the division of responsibilities is crucial:
- **AWS Responsibility (Security Of the Cloud)**: AWS is responsible for the security of the cloud infrastructure, including physical hardware and the software that runs services.
- **User Responsibility (Security In the Cloud)**: You’re responsible for securing your applications, IAM configurations, and data.

|   |   |   |   |
|---|---|---|---|
|Feature|EC2 (IaaS)|RDS (PaaS)|S3 (Storage)|
|Physical Hardware|AWS|AWS|AWS|
|OS Patching|You|AWS|AWS|
|Database Patching|You|AWS|N/A|
|Network Config (VPC/Firewall)|You|You|AWS (mostly)|
|Data Encryption|You|You|You|

### IAM Core Components
- **Users**: Individuals who interact with AWS.
- **User Groups**: Simplifies permissions management by grouping users under common access policies.
- **Roles**: Permissions for AWS services or users, allowing temporary access.
- **Policies**: Documents defining permissions for AWS resources.
- **MFA**: Enhances security by requiring additional verification.

### Credential Compromise Response Steps
In case of a credential compromise:
1. Deactivate access keys immediately.
2. Attach a "Deny All" policy to the affected user.
3. Remove any active sessions to prevent unauthorized access.
4. Rotate or change your credentials.
5. Investigate the root cause to prevent future incidents.

## Hands-On Practice
1. **Creating an IAM User**:
   - Navigate to the IAM console in AWS.
   - Click on “Users” and then “Add User”.
   - Enter a user name and select “Programmatic access”.
   - Attach existing policies directly or create a new policy.
   - Example Policy JSON:
     ```json
     {
       "Version": "2012-10-17",
       "Statement": [
         {
           "Effect": "Allow",
           "Action": "s3:*",
           "Resource": "*"
         }
       ]
     }
     ```
     # Replace with your actual policy

2. **Enabling MFA**:
   - In the IAM console, select the user and click on “Security credentials”.
   - Click on “Manage” next to “Assigned MFA device”.
   - Follow the prompts to set up MFA.

3. **Responding to Credential Compromise**:
   - Go to IAM, select the compromised user, and click on “Security credentials”.
   - Deactivate the access keys and apply a “Deny All” policy.
   - Rotate your credentials and investigate the cause.

## Key Takeaways
Today, you’ve explored the foundational security principles of the CIA Triad and AAA model, and how they apply in AWS. Understanding the shared responsibility model is crucial for any cloud user, as it delineates who is accountable for what. By mastering IAM components and responding effectively to security incidents, you can significantly enhance the security posture of your cloud applications.

## Real-World Applications
In a real-world context, these concepts come into play when managing sensitive data in healthcare or finance. For example, a financial institution must ensure that customer data is encrypted (confidentiality), backed up with versioning to prevent loss (integrity), and accessible even during high traffic (availability). Moreover, using IAM effectively allows the institution to manage who can access this data, ensuring compliance with regulations like GDPR or HIPAA.

---
**Journey Progress:** 62/100 Days Complete 🚀