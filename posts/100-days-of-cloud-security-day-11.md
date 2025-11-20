---
title: '100 Days of Cloud Security - Day 11: Cloud Security Journey'
date: '2025-11-20'
author: 'Venkata Pathuri'
excerpt: 'Day 11 of my cloud security journey - Cloud Security Journey'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 11: Cloud Security Journey

## Overview
Welcome to Day 11 of our cloud security learning journey! Today, we dive into the world of AWS Cognito and explore how its vulnerabilities can be exploited. Building upon the foundational concepts from Day 10, where we examined the principles of identity and access management, we will engage in a hands-on attack scenario using CloudGoat. This experience not only broadens our understanding of cloud security risks but also equips us with the knowledge to better defend against such vulnerabilities in real-world applications.

## Learning Objectives
By the end of today’s session, you will master the intricacies of AWS Cognito, understand the attack vectors associated with identity pools, and gain practical experience in exploiting misconfigurations. You will learn how to enumerate user attributes, escalate privileges, and pivot to AWS credentials. This knowledge is crucial as it helps you recognize vulnerabilities in user management systems and reinforces best practices for securing cloud environments.

## Deep Dive
### Understanding AWS Cognito
Amazon Cognito is a powerful service that facilitates user authentication and management for web and mobile applications. It comprises two key components: **User Pools** and **Identity Pools**. User Pools serve as directories where user information, such as email and passwords, is stored and managed, while Identity Pools provide temporary AWS credentials, allowing users to access AWS resources securely.

In today’s scenario, we focus on a vulnerable configuration within Cognito’s identity pool, enabling us to exploit the application’s access control mechanisms.

### The Attack Scenario: `vulnerable_cognito`
Our attack scenario involves a standard penetration testing methodology:

1. **Enumeration**: Extracting vital information from the application's source code.
2. **Gaining Access**: Leveraging the gathered information to gain unauthorized access to resources.

The initial phase of enumeration revealed the User Pool ID, Client ID, and Identity Pool ID. By inspecting hidden pages and utilizing the AWS CLI, we managed to bypass the user sign-up verification process, allowing us to create an account quickly and confirm our identity.

### Privilege Escalation
After logging in with our newly created account, we hypothesized that the application might allow us to modify our `custom:access` attribute. By executing the `update-user-attributes` command, we escalated our privileges to "admin." This step illustrates a common pitfall in application security, where user attributes are writable without proper validation, leading to potential access control vulnerabilities.

### Acquiring AWS Credentials
Once we established ourselves as an admin user, we obtained an ID Token and used it to retrieve a federated Identity ID. This was crucial for exchanging the Identity ID for temporary AWS credentials, granting us broad access to AWS resources such as S3, Cognito, and Lambda.

## Hands-On Practice
To replicate this scenario, follow these steps:

1. **Deploy the CloudGoat scenario**: Launch the `vulnerable_cognito` in your AWS environment.
2. **Perform enumeration**:
   - Access the provided URL to view the login/signup page.
   - Inspect the HTML source to extract the User Pool ID, Client ID, and Identity Pool ID.
3. **Sign up a user**:
   ```bash
   aws cognito-idp sign-up --client-id 693ps117isv4gk3d6sa7fh7ftb --username 'attacker@example.com' --password 'P@ssword123!' --user-attributes '[{"Name":"given_name","Value":"Attacker"},{"Name":"family_name","Value":"User"}]'
   ```
4. **Confirm the user**:
   ```bash
   aws cognito-idp admin-confirm-sign-up --user-pool-id us-east-1_vWfb2fStY --username 'attacker@example.com'
   ```
5. **Login and inspect your attributes**:
   ```bash
   aws cognito-idp get-user --access-token [REDACTED_ACCESS_TOKEN]
   ```
6. **Modify user attributes**:
   ```bash
   aws cognito-idp update-user-attributes --access-token [REDACTED_ACCESS_TOKEN] --user-attributes '[{"Name":"custom:access","Value":"admin"}]'
   ```
7. **Fetch AWS credentials**:
   ```bash
   aws cognito-identity get-credentials-for-identity --region us-east-1 --identity-id 'us-east-1:e8447a5e-6004-c883-8d36-5515f1aaa0ef' --logins 'cognito-idp.us-east-1.amazonaws.com/us-east-1_vWfb2fStY=[REDACTED_ID_TOKEN]'
   ```

### Expected Outcomes
If executed correctly, you will successfully escalate your privileges and receive temporary AWS credentials, allowing you access to various AWS services. To verify success, check the permissions of the IAM role associated with your new credentials.

### Common Troubleshooting Tips
- Ensure that your AWS CLI is configured properly with the necessary permissions.
- Double-check the syntax of your commands for any typos.
- If you encounter issues, re-evaluate the attributes you're trying to modify and ensure they are indeed writable.

## Key Takeaways
Today’s exploration of the `vulnerable_cognito` scenario highlights the importance of understanding identity and access management within cloud environments. We learned how seemingly innocuous user attributes could be exploited to gain unauthorized access, reinforcing the need for robust validation mechanisms. This exercise serves as a reminder that cloud security is not just about protecting infrastructure but also ensuring that user management systems are resilient against manipulation.

## Real-World Applications
In production environments, the findings from today’s exercise underscore the critical need for stringent access controls and proper attribute validation. Organizations must adopt a defense-in-depth approach by implementing multi-factor authentication, continuous monitoring, and regular audits of user attributes and permissions. By doing so, they can mitigate the risks associated with identity pool misconfigurations and maintain a secure cloud infrastructure.

---
**Journey Progress:** 11/100 Days Complete 🚀