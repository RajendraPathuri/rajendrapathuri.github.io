---
title: '100 Days of Cloud Security - Day 84: CICD Goat - Insufficient Flow Control Mechanisms'
date: '2026-02-02'
author: 'Venkata Pathuri'
excerpt: 'Day 84 of my cloud security journey - CICD Goat - Insufficient Flow Control Mechanisms'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 84: CICD Goat - Insufficient Flow Control Mechanisms

## Overview
Welcome back to Day 84 of our cloud security journey! Today, we delve into a fascinating area of Continuous Integration and Continuous Deployment (CI/CD) security: **Insufficient Flow Control Mechanisms**. Building on the foundational concepts from Day 83, where we explored secure coding practices, this challenge will enhance your understanding of how security can be compromised within CI/CD pipelines. Get ready to uncover how attackers can exploit insufficient controls and learn how to fortify your practices against such vulnerabilities!

## Learning Objectives
By the end of today's session, you will master the art of identifying and mitigating insufficient flow control mechanisms in CI/CD pipelines. You will learn how to bypass Static Application Security Testing (SAST) tools through clever tactics while gaining insights into fortifying your pipeline against such evasive maneuvers. Armed with knowledge about obscuring code and controlling security logic, you will be better equipped to protect your applications from potential threats.

## Deep Dive
At the heart of today's challenge lies the concept of **Defense Evasion**. In CI/CD environments, security tools like Checkov, tfsec, and OPA play a crucial role in scanning Infrastructure as Code (IaC) for misconfigurations and vulnerabilities. However, these tools can be misled if developers do not implement proper flow control mechanisms.

### Understanding the Challenge
Our mission is to deploy an S3 bucket with public-read access, despite the CI/CD pipeline being configured to block such configurations. The pipeline utilizes Checkov as a static scanner, which is programmed to fail the build if it detects the forbidden `acl = "public-read"` in `main.tf`. To achieve our goal, we must outsmart the scanner using two distinct methods.

#### Method 1: Obfuscation (The Syntax Trick)
In this approach, we cleverly hide our intention from the scanner. Since Checkov relies on regex patterns to detect specific strings, we can use the `join` function in Terraform to separate the keyword "public-read" into parts, making it unrecognizable to the scanner while still functional for Terraform.

Here’s how you would implement it in `main.tf`:

```hcl
resource "aws_s3_bucket" "dodo" {
  bucket        = var.bucket_name
  # The scanner looks for "public-read". 
  acl           = join("-", ["public", "read"]) 
  
  versioning {
    enabled = true
  }
  replication_configuration {
    role = aws_iam_role.replication.arn
    rules {
      id     = "foobar"
      status = "Enabled"
      destination {
        bucket        = aws_s3_bucket.backup.arn
        storage_class = "STANDARD"
      }
    }
  }
}
```
This technique allows Terraform to execute the command correctly while the scanner is none the wiser.

#### Method 2: Malicious Configuration (The Configuration Override)
Alternatively, we can explicitly set the ACL to `public-read` but manipulate the scanner's behavior to ignore this violation.

1. **Step 1:** Modify `main.tf` to include the forbidden ACL:
    ```hcl
    acl = "public-read"
    ```

2. **Step 2:** Create a `.checkov.yaml` file in the root directory:
    ```yaml
    soft-fail: true
    check:
      - MY_CHECK
    ```

The `soft-fail: true` directive allows Checkov to ignore any violations it finds, effectively silencing the security scanner. By implementing this configuration, we can successfully deploy the public S3 bucket, achieving our goal.

### Best Practices
To safeguard your CI/CD pipelines against such exploits, consider the following best practices:

1. **Centralized Security Logic**: Avoid allowing local configurations to dictate security rules. Instead, enforce them directly in the CI/CD pipeline scripts, ensuring that developers can't disable essential checks.

2. **Scan Execution Plans**: To prevent obfuscation tactics, always scan the execution plans of your Terraform configurations rather than just the raw code. This approach ensures that all variables and functions are resolved into their final values.

    ```bash
    # Generate the binary plan
    terraform plan -out=tf.plan
    
    # Convert the plan to a readable JSON format
    terraform show -json tf.plan > tf.json
    
    # Scan the JSON plan file
    checkov -f tf.json
    ```

3. **Locked Security Policies**: Maintain critical security policies in a separate, locked repository, preventing developers from making unauthorized changes.

## Hands-On Practice
To put your knowledge into practice, try the following steps in your CI/CD environment:

1. **Set Up Your Environment**: Begin by configuring your Terraform environment and ensuring you have the necessary permissions to deploy resources.

2. **Implement the Configuration**: Use the methods described above to create an S3 bucket with `public-read` access while attempting to bypass the Checkov scanner.

3. **Verify Deployment**: After deployment, check the AWS Management Console to confirm that the S3 bucket is publicly accessible. You should see an output flag in the job’s console output indicating success.

4. **Troubleshooting Tips**:
   - Ensure your Terraform files are correctly formatted and syntactically valid.
   - Check the permissions of your IAM roles to verify they have the necessary access to create S3 buckets.

**Note:** Remember to use placeholder credentials marked clearly as examples, such as `AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours` for access keys and `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` for secret keys.

## Key Takeaways
Today, we explored how insufficient flow control mechanisms can lead to security vulnerabilities in CI/CD pipelines. By learning to obfuscate code and manipulate scanner configurations, we uncovered techniques that malicious actors might use to bypass security measures. However, with proper practices in place, such as centralized security logic and scanning execution plans, we can better protect our applications and infrastructure.

## Real-World Applications
Understanding these concepts is critical in production environments, where security cannot be an afterthought. As organizations increasingly rely on CI/CD pipelines for rapid deployment, ensuring robust security measures is essential. By implementing the practices discussed today, you can create a secure development lifecycle that minimizes vulnerabilities and enhances your organization's overall security posture.

---
**Journey Progress:** 84/100 Days Complete 🚀