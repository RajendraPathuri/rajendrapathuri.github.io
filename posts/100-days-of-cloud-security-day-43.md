---
title: '100 Days of Cloud Security - Day 43: Hardening — ecs_takeover'
date: '2025-12-22'
author: 'Venkata Pathuri'
excerpt: 'Day 43 of my cloud security journey - Hardening — ecs_takeover'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 43: Hardening — ecs_takeover

## Overview
Welcome to Day 43 of our cloud security journey! Building upon our previous learnings, we will dive into hardening the `ecs_takeover` scenario in CloudGoat. By focusing on access restrictions and securing our containerized applications, we can significantly reduce potential attack surfaces and fortify our cloud infrastructure against unauthorized access. Let’s explore how to implement essential security measures that protect our ECS resources.

## Learning Objectives
Today, you will master the art of hardening cloud environments by applying the principle of least privilege, implementing secure container practices, and enforcing metadata service security. By the end of this session, you’ll be equipped with practical skills to secure your ECS services, understand the importance of Instance Metadata Service Version 2 (IMDSv2), and implement robust security groups to safeguard your applications against common vulnerabilities.

## Deep Dive

### IAM Permissions
In our `iam.tf` file, we took significant steps to enhance security by removing overly permissive IAM permissions. By eliminating the permissions such as `iam:GetPolicyVersion`, `iam:GetPolicy`, `iam:ListAttachedRolePolicies`, and `iam:GetRolePolicy` from the `privd` role, we minimized the risk of privilege escalation.

Real-world Example: Consider a scenario where a low-privileged user could exploit these permissions to gain insights into policies and roles, thus crafting a strategy for unauthorized access. By restricting resource access from wildcard (`*`) to specific Amazon Resource Names (ARNs) for ECS resources, we are applying the principle of least privilege, ensuring that users can only access what they absolutely need.

### Container Security
In the `ecs.tf` configuration, we made crucial adjustments to our container definitions. 
1. **Volume Mount Removal:** We deleted the dangerous `/var/run/docker.sock` volume mount from the `vulnsite` container. This change prevents container escape attacks where an attacker could gain control over the Docker daemon on the host.

2. **Privileged Mode:** By setting `privileged` to `false`, we ensure that our containers do not have access to all host devices, thereby blocking potential container breakout scenarios.

### EC2 Metadata Options
We also upgraded our EC2 instances by enforcing IMDSv2, which enhances security by requiring session tokens. Here’s how we configured it:

```json
metadata_options {
  http_endpoint               = "enabled"
  http_tokens                 = "required"
  http_put_response_hop_limit = 1
}
```

The requirement for `http_tokens` helps to mitigate Server-Side Request Forgery (SSRF) attacks, ensuring that only the instance itself can access its metadata.

### Security Group Hardening
In the `vpc.tf` file, we removed the HTTP ingress rule allowing traffic on port 80 to enforce HTTPS-only communication. This is an essential step in ensuring that all data transmitted is encrypted, reducing the risk of eavesdropping and man-in-the-middle attacks.

## Hands-On Practice
To solidify your understanding, let’s implement these changes:

1. **Update IAM Roles:** Edit your `iam.tf` file to remove the unnecessary permissions and specify the ARNs for your ECS resources.
2. **Configure ECS Services:** Modify your `ecs.tf` file to remove the Docker socket volume and ensure that the `privileged` flag is set to `false`.
3. **Set up EC2 Metadata Options:** Add the `metadata_options` block to your EC2 instance definitions in `ec2.tf`.
4. **Secure Security Groups:** In your `vpc.tf` file, delete any ingress rules that allow traffic on port 80.

**Expected Outcome:** After implementing these changes, your ECS services should be more secure, reducing the risk of unauthorized access and attacks.

**Verification:** You can verify your IAM roles and permissions by using the AWS CLI command:

```bash
aws iam get-role --role-name privd # Replace with your actual role name
```

**Common Troubleshooting Tips:** 
- If your ECS services fail to start, check the IAM permissions and ensure they conform to the least privilege principle.
- For issues with EC2 metadata access, verify that IMDSv2 is correctly configured.

## Key Takeaways
Today’s journey into hardening the `ecs_takeover` scenario has equipped you with vital security practices. By implementing least privilege access, securing container configurations, and enforcing IMDSv2, you can significantly enhance your cloud security posture. Remember, security is not a one-time effort but an ongoing process that requires vigilance and regular updates to your configurations.

## Real-World Applications
In production environments, these hardening strategies are crucial. Organizations must comply with regulatory standards and best practices to protect sensitive data. By applying these techniques, businesses can not only safeguard their applications but also build trust with their customers, ensuring that their information remains secure in the cloud.

---
**Journey Progress:** 43/100 Days Complete 🚀