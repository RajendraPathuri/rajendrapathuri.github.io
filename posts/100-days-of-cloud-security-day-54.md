---
title: '100 Days of Cloud Security - Day 54: Cloud Security Journey'
date: '2026-01-02'
author: 'Venkata Pathuri'
excerpt: 'Day 54 of my cloud security journey - Cloud Security Journey'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 54: Cloud Security Journey

## Overview
Welcome to Day 54 of our cloud security journey! Today, we dive into the world of hardening cloud environments against detection evasion techniques. Building on the knowledge gained in Day 53, where we explored the fundamentals of IAM roles and policies, we will now implement practical measures to secure our AWS resources. This learning experience will empower you to create a resilient cloud infrastructure that can withstand common evasion tactics employed by malicious actors.

## Learning Objectives
By the end of today's session, you will master several crucial hardening techniques designed to strengthen your cloud security posture. You will learn how to enforce Instance Metadata Service Version 2 (IMDSv2) for EC2 instances, restrict IAM role policies to prevent unauthorized access to secrets, and set up CloudWatch alarms for detecting potential spoofing attempts. These skills will not only enhance your understanding of cloud security but also prepare you for real-world scenarios where proactive measures are essential to protect sensitive data.

## Deep Dive
### Enforcing IMDSv2
The Instance Metadata Service (IMDS) is a crucial feature of AWS EC2 instances that allows applications running on the instance to access instance metadata. However, using the default settings can pose security risks, such as token theft. To mitigate this, we enforce IMDSv2, which requires the use of session-based tokens for accessing metadata.

In your Terraform configuration for EC2 instances (`ec2.tf`), you can enforce IMDSv2 by adding the following block:

```hcl
resource "aws_instance" "easy_path" {
  metadata_options {
    http_tokens                 = "required" # Enforce IMDSv2
    http_put_response_hop_limit = 1          # Limit response hops
  }
  associate_public_ip_address = false # Disable public access
}
```

This configuration ensures that only requests using the IMDSv2 token are accepted, drastically reducing the risk of unauthorized access.

### Restricting Secret Access
In our `iam.tf` file, we will tighten security around sensitive information stored in AWS Secrets Manager. By explicitly denying access to secrets for certain ARNs, we reduce the risk of data exposure. For example:

```hcl
resource "aws_iam_role_policy" "instance_profile_easy_path" {
  # Other policy details
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect   = "Deny"
        Action   = "secretsmanager:GetSecretValue"
        Resource = ["arn:aws:secretsmanager:us-west-2:123456789012:secret:MySecret1", "arn:aws:secretsmanager:us-west-2:123456789012:secret:MySecret2"]
      }
    ]
  })
}
```

This configuration ensures that only authorized users can access sensitive secrets, thereby enhancing your overall security posture.

### Detecting VPC Spoofing
To detect potential spoofing attempts, we will create CloudWatch metric filters. This allows us to monitor unusual patterns, such as mismatches between user identities and VPC endpoint IDs. Here’s how you can set up the metric filter:

```hcl
resource "aws_cloudwatch_log_metric_filter" "vpc_spoofing" {
  log_group_name = "your-log-group-name"
  metric_transformation {
    name      = "VPCSpoofingDetections"
    namespace = "AWS/YourNamespace"
    value     = "1"
  }
  filter_pattern = "{ $.userIdentity.arn = \"*Role*\" && $.vpcEndpointId != \"your-valid-vpc-endpoint-id\" }"
}
```

This metric filter will trigger an alert when it detects a role using a VPC endpoint ID that doesn’t match the expected configuration.

## Hands-On Practice
Now it’s time for some hands-on practice! Follow these steps to implement the hardening measures discussed:

1. **Update your `ec2.tf` file** to include the IMDSv2 enforcement and disable public access as shown earlier.
2. **Modify your `iam.tf` file** to restrict secret access by adding the Deny policy for specific ARNs.
3. **Create CloudWatch metric filters** in your `cloudwatch.tf` file to monitor for VPC spoofing and SSM usage.

### Expected Outcomes
After implementing these configurations, you should notice improved security posture for your EC2 instances and IAM roles. You can verify the changes by checking the AWS Management Console for your IAM policies and monitoring CloudWatch for any alerts regarding spoofing.

### Common Troubleshooting Tips
- If your CloudWatch alarms are not triggering, ensure that your log groups are correctly configured and that the filter patterns match the expected log format.
- Double-check your IAM policy conditions to ensure they are correctly defined, especially the ARNs specified for the secrets.

## Key Takeaways
Today, we learned the importance of hardening our cloud environments against detection evasion tactics. By enforcing IMDSv2, restricting IAM role access to secrets, and setting up CloudWatch alerts for potential spoofing, we have significantly enhanced our cloud security. These practices not only protect sensitive information but also empower organizations to respond effectively to security threats in real time.

## Real-World Applications
In real production environments, implementing these hardening techniques is critical. Organizations face constant threats from cybercriminals looking to exploit vulnerabilities. By adopting these practices, businesses can ensure that their cloud infrastructure remains secure and compliant, fostering trust among customers and stakeholders.

---
**Journey Progress:** 54/100 Days Complete 🚀