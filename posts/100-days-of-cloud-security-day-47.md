---
title: '100 Days of Cloud Security - Day 47: Hardening — iam_privesc_by_ec2'
date: '2025-12-26'
author: 'Venkata Pathuri'
excerpt: 'Day 47 of my cloud security journey - Hardening — iam_privesc_by_ec2'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 47: Hardening — iam_privesc_by_ec2

## Overview
Welcome back to Day 47 of our cloud security journey! Today, we take a significant step forward as we dive into hardening our AWS environment through the `iam_privesc_by_ec2` scenario. Building on our previous discussions about IAM roles and permissions from Day 46, we will strengthen our EC2 instance configurations and IAM policies to mitigate potential privilege escalation vulnerabilities.

## Learning Objectives
By the end of this session, you will have mastered essential hardening techniques for IAM roles and EC2 instances. You will learn how to enforce stringent policies, implement security best practices, and ensure that your cloud environment is resilient against unauthorized access. This knowledge will empower you to make informed decisions as you secure your AWS infrastructure.

## Deep Dive
### Understanding Privilege Escalation via EC2
Privilege escalation can occur when an IAM user gains unauthorized access to elevated permissions, often through misconfigured policies or overly permissive role assignments. Today, we will harden our setup to ensure that only authorized actions are allowed, mitigating these risks effectively.

### Key Actions in `iam.tf`
1. **Fixed Condition Logic**: By changing the condition logic for `ec2_manage_permissions` from `StringNotEquals` to `StringEquals`, we ensure that only the specified values can be used, closing a potential loophole for bypassing access controls.
   
   ```hcl
   resource "aws_iam_policy" "ec2_manage_permissions" {
     ...
     condition {
       test     = "StringEquals"
       variable = "aws:ResourceTag/cg_admin_ec2"
       values   = ["cg_admin_ec2_${var.cgid}"]
     }
   }
   ```

2. **Resource-Based Restrictions**: Instead of using wildcards (`*`) in our IAM policies, we will target specific resource ARNs. This practice narrows the scope of access and reduces the attack surface significantly.

   ```hcl
   resource "aws_iam_policy" "dev_ec2_permissions" {
     ...
     resource = ["arn:aws:ec2:${var.region}:${var.account_id}:instance/${aws_instance.example.id}"]
   }
   ```

3. **Removed Dangerous Permission**: By deleting `ec2:ModifyInstanceAttribute` from the `ec2_management_role`, we prevent attackers from manipulating userdata, which could lead to security breaches.

4. **Replaced Excessive Privileges**: Changing from `AdministratorAccess` to `AmazonEC2FullAccess` limits the EC2 role's permissions effectively, allowing only the necessary access required for the role to function.

5. **Restricted ReadOnly Access**: We removed the account-wide `ReadOnlyAccess` policy from the `dev_user_policy_attach`. Instead, we focused on specific EC2 read operations like `ec2:Describe*`, ensuring users have only the information they need.

6. **Strengthened Conditions**: The conditions in our policies are tightened to ensure that only instances tagged with `cg_admin_ec2_${var.cgid}` are manageable by the defined roles, significantly reducing the risk of unauthorized access to sensitive EC2 instances.

### Enhancements in `ec2.tf`
1. **Enforced IMDSv2**: We added a metadata options block to mandate the use of Instance Metadata Service Version 2 (IMDSv2), which protects against Server-Side Request Forgery (SSRF) attacks.

   ```hcl
   resource "aws_instance" "example" {
     ...
     metadata_options {
       http_tokens = "required"
     }
   }
   ```

2. **Enabled EBS Encryption**: By enabling EBS encryption, we ensure that data at rest is protected, safeguarding sensitive information from unauthorized access.

   ```hcl
   resource "aws_ebs_volume" "example" {
     ...
     encrypted = true
   }
   ```

## Hands-On Practice
To put these concepts into practice, follow these steps:

1. **Update Your Terraform Files**: Modify your `iam.tf` and `ec2.tf` according to the hardening steps outlined above.
  
2. **Deploy Changes**: Run the following commands to apply the changes:
   ```bash
   terraform init
   terraform apply
   ```

3. **Verify Success**:
   - Check the IAM policies in the AWS Management Console to ensure they reflect the updated configurations.
   - Launch an EC2 instance and confirm that the metadata options are set to use IMDSv2.

4. **Common Troubleshooting Tips**: If you encounter permission errors, double-check the ARNs specified in your IAM policies and ensure that you are using the correct tags for resource identification.

## Key Takeaways
In today’s session, we reinforced the importance of principle of least privilege by implementing stricter IAM policies and EC2 configurations. By focusing on specific resource ARNs, tightening conditions, and eliminating unnecessary permissions, we have significantly bolstered our security posture against potential privilege escalation attacks.

## Real-World Applications
These hardening techniques are vital in production environments where security is paramount. For instance, organizations that handle sensitive data, such as financial institutions or healthcare providers, must implement these best practices to comply with regulations and protect against data breaches. By adopting these strategies, teams can ensure that only authorized users have access to critical resources, reducing the risk of insider threats and external attacks.

---
**Journey Progress:** 47/100 Days Complete 🚀