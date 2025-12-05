---
title: '100 Days of Cloud Security - Day 26: Hardening - `ec2_ssrf`'
date: '2025-12-05'
author: 'Venkata Pathuri'
excerpt: 'Day 26 of my cloud security journey - Hardening - `ec2_ssrf`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 26: Hardening - `ec2_ssrf`

## Overview
Welcome to Day 26 of our cloud security journey! Today, we delve into the critical area of hardening against Server-Side Request Forgery (SSRF) attacks in AWS environments, specifically focusing on the `ec2_ssrf` scenario. Building on our previous discussions about IAM policies and least privilege principles, we will explore how to enhance our security posture and safeguard sensitive resources, particularly S3 credentials, from unauthorized access.

## Learning Objectives
By the end of this session, you will master the implementation of robust security controls to prevent SSRF vulnerabilities. You’ll learn how to apply the principle of least privilege in IAM roles, enforce secure access to the AWS metadata service, and utilize AWS Systems Manager Parameter Store for secret management. This knowledge will empower you to design and deploy secure AWS environments that are resilient against common attack vectors.

## Deep Dive
In the world of cloud security, SSRF attacks represent a serious threat, allowing attackers to exploit misconfigurations and gain unauthorized access to sensitive resources. With the `ec2_ssrf` scenario, we face a multifaceted attack path that an adversary might exploit if they gain access to a compromised EC2 instance.

### Key Concepts and Best Practices
1. **IAM Policies and Least Privilege**: Overly permissive IAM roles are an open invitation for attackers. In our example, we've transitioned from a wildcard policy (e.g., `s3:*`) to more granular permissions like `s3:GetObject` and `s3:ListBucket`. This ensures that users can only perform necessary actions on specific resources, minimizing the potential attack surface.

   ```hcl
   resource "aws_iam_policy" "lambda_policy" {
       name        = "LambdaAccessPolicy"
       description = "Policy for Lambda to access specific SSM parameters"
       policy      = jsonencode({
           Version = "2012-10-17",
           Statement = [
               {
                   Effect    = "Allow",
                   Action    = [
                       "ssm:GetParameter",
                       "ssm:GetParameters",
                   ],
                   Resource  = "arn:aws:ssm:region:account-id:parameter/EC2_CREDENTIALS_PARAM"
               },
           ]
       })
   }
   ```

2. **Metadata Service Security**: AWS EC2 instances come with a metadata service that can expose sensitive data, such as instance credentials. By enforcing Instance Metadata Service v2 (IMDSv2), we require token-based authentication, adding a layer of protection. The configuration:

   ```hcl
   resource "aws_instance" "my_instance" {
       ami           = "ami-12345678"
       instance_type = "t2.micro"
       metadata_options {
           http_tokens               = "required"
           http_put_response_hop_limit = 1
       }
   }
   ```

3. **Secure Storage of Credentials**: Instead of hardcoding AWS access keys directly in your Lambda functions or S3 objects, we now utilize AWS Systems Manager Parameter Store. Storing credentials as `SecureString` ensures that sensitive information is encrypted and only accessible to authorized entities.

   ```hcl
   resource "aws_ssm_parameter" "ec2_credentials" {
       name  = "EC2_CREDENTIALS_PARAM"
       type  = "SecureString"
       value = "AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours:wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
   }
   ```

### Real-World Example
Consider a scenario in which a developer inadvertently grants an EC2 instance the `s3:*` permission. An attacker could exploit this by making requests to the metadata service, obtaining IAM role credentials, and accessing sensitive S3 buckets. By applying the hardening measures outlined in this post, such as refining IAM policies and securing metadata access, we can effectively mitigate this risk.

## Hands-On Practice
To apply what you’ve learned, follow these steps:

1. Update your `lambda.tf` to replace hardcoded credentials with a reference to the Parameter Store:

   ```hcl
   environment {
       EC2_CREDENTIALS_PARAM = "${aws_ssm_parameter.ec2_credentials.arn}"
   }
   ```

2. Review and modify your EC2 instance configuration in `ec2.tf` to enforce IMDSv2 settings, as shown in the earlier examples.

3. Test the Lambda function to ensure it can retrieve credentials from Parameter Store without exposing them in the environment.

4. **Expected Outcome**: Your Lambda function should operate normally, but credentials should no longer be accessible through environment variable inspection.

5. **Common Troubleshooting Tip**: If you encounter permission errors, double-check your IAM policies to ensure the correct permissions are granted and that the resource ARNs are accurate.

## Key Takeaways
Today’s learning journey highlights the importance of hardening AWS environments against SSRF attacks. By implementing least privilege IAM policies, enforcing IMDSv2, and securely managing credentials through Parameter Store, you significantly reduce the risk of unauthorized access to sensitive resources. Remember, security is a continuous process, and regular audits of IAM roles and policies are essential.

## Real-World Applications
In production environments, these hardening measures are vital for maintaining compliance with security standards and regulations. Organizations that adopt these practices can prevent costly data breaches and maintain customer trust. With the rise of cloud-native architectures, understanding and implementing these security measures not only protects sensitive data but also fortifies the overall cloud security posture.

---
**Journey Progress:** 26/100 Days Complete 🚀